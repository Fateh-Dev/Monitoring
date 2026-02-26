using Monitoring.Domain.Enums;

namespace Monitoring.Domain.Entities;

public class Server
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string IpAddress { get; set; }
    public required string HealthUrl { get; set; }
    public string? ApiKey { get; set; }
    public bool IsActive { get; set; } = true;
    public double UptimePercentage { get; set; } = 100.0;
    
    public ICollection<Check> Checks { get; set; } = new List<Check>();
    public ICollection<Incident> Incidents { get; set; } = new List<Incident>();
}

public class Check
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ServerId { get; set; }
    public Server? Server { get; set; }
    public DateTime MeasuredAt { get; set; } = DateTime.UtcNow;
    public double ResponseTimeMs { get; set; }
    public HealthStatus Status { get; set; }
    public string? Details { get; set; }
}

public class Incident
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ServerId { get; set; }
    public Server? Server { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
    public string? Reason { get; set; }
}
