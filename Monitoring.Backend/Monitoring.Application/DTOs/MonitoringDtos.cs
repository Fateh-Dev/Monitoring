using System.Text.Json.Serialization;
using Monitoring.Domain.Enums;

namespace Monitoring.Application.DTOs;

public record ServerDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("nom")] string Name,
    [property: JsonPropertyName("adresseIp")] string IpAddress,
    [property: JsonPropertyName("urlSante")] string HealthUrl,
    [property: JsonPropertyName("estActif")] bool IsActive,
    [property: JsonPropertyName("pourcentageUptime")] double UptimePercentage,
    [property: JsonPropertyName("dernierStatut")] HealthStatus LastStatus,
    [property: JsonPropertyName("dernierTempsReponseMs")] double LastResponseTimeMs,
    [property: JsonPropertyName("derniereVerification")] DateTime LastCheck
);

public record CheckDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("mesureLe")] DateTime MeasuredAt,
    [property: JsonPropertyName("tempsReponseMs")] double ResponseTimeMs,
    [property: JsonPropertyName("statut")] HealthStatus Status,
    [property: JsonPropertyName("details")] string? Details
);

public record IncidentDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("debutLe")] DateTime StartedAt,
    [property: JsonPropertyName("resoluLe")] DateTime? ResolvedAt,
    [property: JsonPropertyName("raison")] string? Reason
);

public record CreateServerDto(
    [property: JsonPropertyName("nom")] string Name,
    [property: JsonPropertyName("adresseIp")] string IpAddress,
    [property: JsonPropertyName("urlSante")] string HealthUrl,
    [property: JsonPropertyName("apiKey")] string? ApiKey,
    [property: JsonPropertyName("estActif")] bool? IsActive
);

public record GlobalIncidentDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("debutLe")] DateTime StartedAt,
    [property: JsonPropertyName("resoluLe")] DateTime? ResolvedAt,
    [property: JsonPropertyName("raison")] string? Reason,
    [property: JsonPropertyName("serveurId")] Guid ServerId,
    [property: JsonPropertyName("serveurNom")] string ServerName
);
