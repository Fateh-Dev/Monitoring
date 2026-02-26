using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Monitoring.Infrastructure.Persistence;
using Monitoring.Infrastructure.Services;

namespace Monitoring.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString
    )
    {
        services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

        services.AddHttpClient();

        // Register Background Service
        services.AddHostedService<MonitoringBackgroundService>();

        return services;
    }
}
