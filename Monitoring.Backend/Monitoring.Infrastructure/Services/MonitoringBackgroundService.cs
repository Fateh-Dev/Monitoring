using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Monitoring.Domain.Entities;
using Monitoring.Domain.Enums;
using Monitoring.Infrastructure.Persistence;

namespace Monitoring.Infrastructure.Services;

public class MonitoringBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<MonitoringBackgroundService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(30);

    public MonitoringBackgroundService(
        IServiceProvider serviceProvider,
        IHttpClientFactory httpClientFactory,
        ILogger<MonitoringBackgroundService> logger
    )
    {
        _serviceProvider = serviceProvider;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Le service de surveillance en arrière-plan démarre.");

        while (!stoppingToken.IsCancellationRequested)
        {
            await MonitorServersAsync(stoppingToken);
            await Task.Delay(_interval, stoppingToken);
        }
    }

    private async Task MonitorServersAsync(CancellationToken ct)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var servers = await context.Servers.Where(s => s.IsActive).ToListAsync(ct);

        foreach (var server in servers)
        {
            await CheckServerAsync(server, context, ct);
        }

        await context.SaveChangesAsync(ct);
    }

    private async Task CheckServerAsync(
        Server server,
        ApplicationDbContext context,
        CancellationToken ct
    )
    {
        var check = new Check { ServerId = server.Id };
        var stopwatch = Stopwatch.StartNew();

        try
        {
            // 1. Ping
            var ping = new Ping();
            var reply = await ping.SendPingAsync(server.IpAddress, 5000);

            if (reply.Status != IPStatus.Success)
            {
                check.Status = HealthStatus.Unreachable;
                check.Details = $"Échec du ping : {reply.Status}";
            }
            else
            {
                // 2. Health Check
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(5);

                if (!string.IsNullOrEmpty(server.ApiKey))
                {
                    client.DefaultRequestHeaders.Add("X-API-KEY", server.ApiKey);
                }

                var response = await client.GetAsync(server.HealthUrl, ct);
                stopwatch.Stop();
                check.ResponseTimeMs = stopwatch.Elapsed.TotalMilliseconds;

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync(ct);
                    // On pourrait parser le JSON ici si besoin
                    check.Status =
                        check.ResponseTimeMs > 1000 ? HealthStatus.Slow : HealthStatus.Healthy;
                    check.Details = "Application saine";
                }
                else
                {
                    check.Status = HealthStatus.Down;
                    check.Details = $"Erreur HTTP : {response.StatusCode}";
                }
            }
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            check.Status = HealthStatus.Down;
            check.Details = $"Erreur : {ex.Message}";
            _logger.LogError(
                ex,
                "Erreur lors de la vérification du serveur {ServerName}",
                server.Name
            );
        }

        context.Checks.Add(check);
        await UpdateServerUptimeAsync(server, context, ct);
        await HandleIncidentsAsync(server, context, ct);
    }

    private async Task UpdateServerUptimeAsync(
        Server server,
        ApplicationDbContext context,
        CancellationToken ct
    )
    {
        var last24h = DateTime.UtcNow.AddDays(-1);
        var checks = await context
            .Checks.Where(c => c.ServerId == server.Id && c.MeasuredAt >= last24h)
            .ToListAsync(ct);

        if (checks.Any())
        {
            var healthyCount = checks.Count(c =>
                c.Status == HealthStatus.Healthy || c.Status == HealthStatus.Slow
            );
            server.UptimePercentage = (double)healthyCount / checks.Count * 100;
        }
    }

    private async Task HandleIncidentsAsync(
        Server server,
        ApplicationDbContext context,
        CancellationToken ct
    )
    {
        // Logic for 3 consecutive failures -> Email alert
        var lastChecks = await context
            .Checks.Where(c => c.ServerId == server.Id)
            .OrderByDescending(c => c.MeasuredAt)
            .Take(3)
            .ToListAsync(ct);

        bool isDown =
            lastChecks.Count == 3
            && lastChecks.All(c =>
                c.Status == HealthStatus.Down || c.Status == HealthStatus.Unreachable
            );

        var ongoingIncident = await context.Incidents.FirstOrDefaultAsync(
            i => i.ServerId == server.Id && i.ResolvedAt == null,
            ct
        );

        if (isDown && ongoingIncident == null)
        {
            var incident = new Incident
            {
                ServerId = server.Id,
                Reason = "3 échecs consécutifs détectés.",
            };
            context.Incidents.Add(incident);
            _logger.LogWarning("ALERTE : Le serveur {ServerName} est hors service !", server.Name);
            // TODO: Send Email
        }
        else if (!isDown && ongoingIncident != null)
        {
            ongoingIncident.ResolvedAt = DateTime.UtcNow;
            _logger.LogInformation(
                "RÉSOLU : Le serveur {ServerName} est de nouveau en ligne.",
                server.Name
            );
        }
    }
}
