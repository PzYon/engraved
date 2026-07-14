using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Engraved.Api;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Bootstrap;
using Engraved.Api.Filters;
using Engraved.Api.Jobs;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Jobs;
using Engraved.Core.Application.Queries;
using Engraved.Core.Domain.Notifications;
using Engraved.Notifications.OneSignal;
using Microsoft.OpenApi;

var isE2ETests = Environment.GetCommandLineArgs().Any(a => a == "e2e-tests");

if (isE2ETests)
{
  Console.WriteLine("Running for e2e tests.");
}

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
  .AddControllers(options =>
    {
      options.Filters.Add<PerfFilter>();
      options.Filters.Add<HttpExceptionFilter>();
    }
  )
  .AddJsonOptions(options =>
    {
      options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

      // serialize values declared as IEntry/IJournal/IEntity with their full runtime type
      options.JsonSerializerOptions.TypeInfoResolver = new DefaultJsonTypeInfoResolver
      {
        Modifiers = { DomainPolymorphism.ConfigurePolymorphism }
      };
    }
  );

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
  {
    // expose the polymorphic domain types (IEntry, IJournal, IEntity) as oneOf schemas
    // instead of the bare interface properties
    option.UseOneOfForPolymorphism();
    option.SelectSubTypesUsing(DomainPolymorphism.GetDerivedTypes);

    option.AddSecurityDefinition(
      "Bearer",
      new OpenApiSecurityScheme
      {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
      }
    );
  }
);

builder.Services.AddHttpContextAccessor();

IConfigurationSection authConfigSection = builder.Configuration.GetSection("Authentication");
IConfigurationSection notificationsSection = builder.Configuration.GetSection("Notifications");
IConfigurationSection oneSignalConfigSection = notificationsSection.GetSection("OneSignal");
IConfigurationSection notificationsJobConfigSection = notificationsSection.GetSection("Job");

// https://learn.microsoft.com/en-us/dotnet/core/extensions/logging?tabs=command-line
if (!builder.Environment.IsDevelopment() && !isE2ETests)
{
  builder.Services.AddOpenTelemetry().UseAzureMonitor();
}

builder.Services.Configure<AuthenticationConfig>(authConfigSection);
builder.Services.Configure<OneSignalConfig>(oneSignalConfigSection);
builder.Services.Configure<NotificationsJobConfig>(notificationsJobConfigSection);
builder.Services.AddTransient<IDateService, DateService>();
builder.Services.AddTransient<ICurrentUserService, CurrentUserService>();
builder.Services.AddTransient<IGoogleTokenValidator, GoogleTokenValidator>();
builder.Services.AddTransient<JwtTokenFactory>();
builder.Services.AddTransient<RefreshTokenService>();
builder.Services.AddTransient<RefreshHandler>();
builder.Services.AddTransient<ILoginHandler, LoginHandler>();
builder.Services.AddSingleton<UserLoader>();
builder.Services.AddHostedService<ScheduledNotificationJob>();

PersistenceRegistration.RegisterPersistence(builder.Services, builder.Configuration, isE2ETests);

builder.Services.AddSingleton(new E2ETestMode(isE2ETests));
builder.Services.AddMemoryCache();
builder.Services.AddTransient<QueryCache>();
builder.Services.AddTransient<Dispatcher>();
builder.Services.AddTransient<NotificationJob>();
builder.Services.AddTransient<INotificationService, OneSignalNotificationService>();

AuthenticationRegistration.RegisterAuthentication(builder.Services, authConfigSection, isE2ETests);

builder.Services.AddResponseCompression(options => { options.EnableForHttps = true; });

ExecutorRegistration.RegisterQueries(builder.Services);
ExecutorRegistration.RegisterCommands(builder.Services);

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// deliberately wide open: auth is bearer-token based (not cookies), so a browser can't get a
// cross-origin request to carry credentials on its own - the client always has to attach the
// token itself, which a foreign origin doesn't have.
app.UseCors(policyBuilder => policyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthentication();
app.UseAuthorization();

app.UseResponseCompression();

app.MapControllers();

app.Run();

// Exposes the implicit entry-point class so WebApplicationFactory<Program> (the startup smoke test)
// can reference it. Top-level statements otherwise generate an internal Program.
namespace Engraved.Api
{
  public class Program;
}
