var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware pour la clé API
app.Use(
    async (context, next) =>
    {
        if (!context.Request.Headers.TryGetValue("X-API-KEY", out var extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Clé API manquante");
            return;
        }

        var apiKey = builder.Configuration.GetValue<string>("ApiSettings:ApiKey") ?? "SecretKey123";
        if (!apiKey.Equals(extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Client non autorisé");
            return;
        }

        await next();
    }
);

app.MapGet(
    "/health",
    () =>
    {
        return Results.Ok(
            new
            {
                status = "Sain",
                databaseStatus = "Connecté",
                serverTime = DateTime.UtcNow,
                version = "1.0.0",
            }
        );
    }
);

app.Run();
