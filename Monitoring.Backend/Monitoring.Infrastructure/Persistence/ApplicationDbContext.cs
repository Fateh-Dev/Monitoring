using Microsoft.EntityFrameworkCore;
using Monitoring.Domain.Entities;

namespace Monitoring.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Server> Servers => Set<Server>();
    public DbSet<Check> Checks => Set<Check>();
    public DbSet<Incident> Incidents => Set<Incident>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Server>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.IpAddress).IsRequired();
            entity.Property(e => e.HealthUrl).IsRequired();
        });

        modelBuilder.Entity<Check>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Server).WithMany(s => s.Checks).HasForeignKey(e => e.ServerId);
        });

        modelBuilder.Entity<Incident>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Server).WithMany(s => s.Incidents).HasForeignKey(e => e.ServerId);
        });
    }
}
