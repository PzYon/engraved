using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Basic;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Filters;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Application.Queries;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

// <HackZone>
var isSeeded = false;
// </HackZone>

bool isE2eTests = Environment.GetCommandLineArgs().Any(a => a == "e2e-tests");

if (isE2eTests)
{
  Console.WriteLine("Running for e2e tests.");
}

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
  .AddControllers(
    options =>
    {
      options.Filters.Add<PerfFilter>();
      options.Filters.Add<HttpExceptionFilter>();
    }
  )
  .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
  option =>
  {
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
    option.AddSecurityRequirement(
      new OpenApiSecurityRequirement
      {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
            {
              Type = ReferenceType.SecurityScheme,
              Id = "Bearer"
            }
          },
          Array.Empty<string>()
        }
      }
    );
  }
);

builder.Services.AddHttpContextAccessor();

IConfigurationSection authConfigSection = builder.Configuration.GetSection("Authentication");

// https://learn.microsoft.com/en-us/dotnet/core/extensions/logging?tabs=command-line
// builder.Logging.AddOpenTelemetry(logging => logging.AddOtlpExporter());
if (!builder.Environment.IsDevelopment())
{
  builder.Services.AddOpenTelemetry().UseAzureMonitor();
}

builder.Services.Configure<AuthenticationConfig>(authConfigSection);
builder.Services.AddTransient<IDateService, DateService>();
builder.Services.AddTransient<ICurrentUserService, CurrentUserService>();
builder.Services.AddTransient<IGoogleTokenValidator, GoogleTokenValidator>();
builder.Services.AddTransient<ILoginHandler, LoginHandler>();
builder.Services.AddSingleton(
  provider =>
  {
    var logger = provider.GetService<ILogger<MongoRepository>>()!;
    return new MongoDatabaseClient(logger, CreateRepositorySettings(builder), GetMongoDbNameOverride());
  }
);
builder.Services.AddTransient(
  provider =>
  {
    if (!UseInMemoryRepo())
    {
      var mongoDbClient = provider.GetService<MongoDatabaseClient>()!;
      return GetMongoDbRepo(mongoDbClient);
    }

    var userService = provider.GetService<ICurrentUserService>()!;

    var inMemoryRepository = new InMemoryRepository();
    IUserScopedRepository repo = new UserScopedInMemoryRepository(inMemoryRepository, userService);
    SeedRepo(repo);

    return inMemoryRepository;
  }
);
builder.Services.AddTransient<IUserScopedRepository>(
  provider =>
  {
    var userService = provider.GetService<ICurrentUserService>()!;

    if (!UseInMemoryRepo())
    {
      var mongoDbClient = provider.GetService<MongoDatabaseClient>()!;
      return new UserScopedMongoRepository(mongoDbClient, userService);
    }

    var inMemoryRepository = provider.GetService<InMemoryRepository>();
    if (inMemoryRepository == null)
    {
      throw new Exception($"Cannot resolve {nameof(InMemoryRepository)}.");
    }

    var repo = new UserScopedInMemoryRepository(inMemoryRepository, userService);

    if (!isSeeded)
    {
      SeedRepo(repo);
      isSeeded = true;
    }

    return repo;
  }
);

builder.Services.AddTransient<Lazy<IUser>>(
  provider => provider.GetService<IUserScopedRepository>()!.CurrentUser
);

builder.Services.AddTransient<IRepository>(
  provider => provider.GetService<IUserScopedRepository>()!
);

builder.Services.AddMemoryCache();
builder.Services.AddTransient<QueryCache>();
builder.Services.AddTransient<Dispatcher>();

if (isE2eTests)
{
  builder.Services.AddAuthentication("BasicAuthentication")
    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
}
else
{
  builder.Services.AddAuthentication(
      options =>
      {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      }
    )
    .AddJwtBearer(
      options =>
      {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(GetJwtSecret(authConfigSection))),
          ValidateAudience = false,
          ValidateIssuer = false,
          ValidateIssuerSigningKey = true,
          ValidateLifetime = true,
          ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
          OnTokenValidated = context =>
          {
            var jwtToken = (JsonWebToken) context.SecurityToken;
            Claim? nameClaim = jwtToken.Claims.First(c => c.Type == "nameid");
            context.HttpContext.RequestServices
              .GetRequiredService<ICurrentUserService>()
              .SetUserName(nameClaim.Value);
            return Task.CompletedTask;
          }
        };
      }
    );
}

ExecutorRegistration.RegisterQueries(builder.Services);
ExecutorRegistration.RegisterCommands(builder.Services);

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(policyBuilder => policyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

bool UseInMemoryRepo()
{
  // return builder.Environment.IsDevelopment();
  return false;
}

string? GetMongoDbNameOverride()
{
  return isE2eTests ? "engraved_e2e_tests" : null;
}

IBaseRepository GetMongoDbRepo(MongoDatabaseClient mongoDatabaseClient)
{
  return new MongoRepository(mongoDatabaseClient);
}

void SeedRepo(IUserScopedRepository repo)
{
  Task seed = new DemoDataRepositorySeeder(repo).Seed();
  if (!seed.IsCompleted)
  {
    seed.Wait();
  }
}

MongoRepositorySettings CreateRepositorySettings(WebApplicationBuilder webApplicationBuilder)
{
  string? connectionString = webApplicationBuilder.Configuration.GetConnectionString("engraved_db");
  if (string.IsNullOrEmpty(connectionString))
  {
    throw new Exception("App Service Config: No connection string available.");
  }

  return new MongoRepositorySettings(connectionString);
}

string GetJwtSecret(IConfigurationSection configurationSection)
{
  var jwtSecret = configurationSection.GetValue<string>(nameof(AuthenticationConfig.JwtSecret));
  if (string.IsNullOrEmpty(jwtSecret))
  {
    throw new Exception("App Service Config: No JWT Secret available.");
  }

  return jwtSecret;
}
