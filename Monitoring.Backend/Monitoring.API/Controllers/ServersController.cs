using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Monitoring.Application.DTOs;
using Monitoring.Domain.Entities;
using Monitoring.Infrastructure.Persistence;

namespace Monitoring.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ServersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServerDto>>> GetServers()
    {
        var servers = await _context
            .Servers.Include(s => s.Checks)
            .Select(s => new ServerDto(
                s.Id,
                s.Name,
                s.IpAddress,
                s.HealthUrl,
                s.IsActive,
                s.UptimePercentage,
                s.Checks.OrderByDescending(c => c.MeasuredAt)
                    .Select(c => c.Status)
                    .FirstOrDefault(),
                s.Checks.OrderByDescending(c => c.MeasuredAt)
                    .Select(c => c.ResponseTimeMs)
                    .FirstOrDefault(),
                s.Checks.OrderByDescending(c => c.MeasuredAt)
                    .Select(c => c.MeasuredAt)
                    .FirstOrDefault()
            ))
            .ToListAsync();

        return Ok(servers);
    }

    [HttpGet("incidents")]
    public async Task<ActionResult<IEnumerable<GlobalIncidentDto>>> GetGlobalIncidents()
    {
        var incidents = await _context
            .Incidents.Include(i => i.Server)
            .OrderByDescending(i => i.StartedAt)
            .Select(i => new GlobalIncidentDto(
                i.Id,
                i.StartedAt,
                i.ResolvedAt,
                i.Reason,
                i.ServerId,
                i.Server.Name
            ))
            .ToListAsync();

        return Ok(incidents);
    }

    [HttpGet("{id}/history")]
    public async Task<ActionResult<IEnumerable<CheckDto>>> GetServerHistory(Guid id)
    {
        var history = await _context
            .Checks.Where(c => c.ServerId == id)
            .OrderByDescending(c => c.MeasuredAt)
            .Take(50)
            .Select(c => new CheckDto(c.Id, c.MeasuredAt, c.ResponseTimeMs, c.Status, c.Details))
            .ToListAsync();

        return Ok(history);
    }

    [HttpGet("{id}/incidents")]
    public async Task<ActionResult<IEnumerable<IncidentDto>>> GetServerIncidents(Guid id)
    {
        var incidents = await _context
            .Incidents.Where(i => i.ServerId == id)
            .OrderByDescending(i => i.StartedAt)
            .Select(i => new IncidentDto(i.Id, i.StartedAt, i.ResolvedAt, i.Reason))
            .ToListAsync();

        return Ok(incidents);
    }

    [HttpPost]
    public async Task<ActionResult<ServerDto>> CreateServer(CreateServerDto dto)
    {
        var server = new Server
        {
            Name = dto.Name,
            IpAddress = dto.IpAddress,
            HealthUrl = dto.HealthUrl,
            ApiKey = dto.ApiKey,
            IsActive = true,
        };

        _context.Servers.Add(server);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetServers),
            new { id = server.Id },
            new ServerDto(
                server.Id,
                server.Name,
                server.IpAddress,
                server.HealthUrl,
                server.IsActive,
                server.UptimePercentage,
                Monitoring.Domain.Enums.HealthStatus.Healthy,
                0,
                DateTime.UtcNow
            )
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateServer(Guid id, CreateServerDto dto)
    {
        var server = await _context.Servers.FindAsync(id);
        if (server == null)
        {
            return NotFound();
        }

        server.Name = dto.Name;
        server.IpAddress = dto.IpAddress;
        server.HealthUrl = dto.HealthUrl;
        server.ApiKey = dto.ApiKey;

        if (dto.IsActive.HasValue)
        {
            server.IsActive = dto.IsActive.Value;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteServer(Guid id)
    {
        var server = await _context.Servers.FindAsync(id);
        if (server == null)
        {
            return NotFound();
        }

        // Suppression des données liées (Cascading should handle this, but explicit is safer)
        var checks = _context.Checks.Where(c => c.ServerId == id);
        _context.Checks.RemoveRange(checks);

        var incidents = _context.Incidents.Where(i => i.ServerId == id);
        _context.Incidents.RemoveRange(incidents);

        _context.Servers.Remove(server);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
