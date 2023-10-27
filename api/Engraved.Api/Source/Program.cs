using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Filters;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo;
using Engraved.Search.Lucene;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

// <HackZone>
var isSeeded = false;
// </HackZone>

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
builder.Services.Configure<AuthenticationConfig>(authConfigSection);
builder.Services.AddTransient<IDateService, DateService>();
builder.Services.AddTransient<ICurrentUserService, CurrentUserService>();
builder.Services.AddTransient<IGoogleTokenValidator, GoogleTokenValidator>();
builder.Services.AddTransient<ILoginHandler, LoginHandler>();
builder.Services.AddSingleton(
  provider =>
  {
    if (!UseInMemoryRepo())
    {
      return GetMongoDbRepo();
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

    if (UseInMemoryRepo())
    {
      var repo = new UserScopedInMemoryRepository(provider.GetService<InMemoryRepository>(), userService);

      if (!isSeeded)
      {
        SeedRepo(repo);
        isSeeded = true;
      }

      return repo;
    }
    else
    {
      return new UserScopedMongoRepository(CreateRepositorySettings(builder), userService);
    }
  }
);
builder.Services.AddTransient<Lazy<IUser>>(
  provider => provider.GetService<IUserScopedRepository>()!.CurrentUser
);
builder.Services.AddMemoryCache();
builder.Services.AddTransient<QueryCache>();
builder.Services.AddTransient<Dispatcher>();

builder.Services.AddTransient<ISearchIndex, LuceneSearchIndex>();
LuceneSearchIndex.WakeUp();

builder.Services.AddAuthentication("BasicAuthentication")
  .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

/*
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
          var jwtToken = (JwtSecurityToken) context.SecurityToken;
          Claim? nameClaim = jwtToken.Claims.First(c => c.Type == "nameid");
          context.HttpContext.RequestServices
            .GetRequiredService<ICurrentUserService>()
            .SetUserName(nameClaim.Value);
          return Task.CompletedTask;
        }
      };
    }
  );
*/

ExecutorRegistration.RegisterCommands(builder.Services);
ExecutorRegistration.RegisterQueries(builder.Services);

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

IRepository GetMongoDbRepo()
{
  return new MongoRepository(CreateRepositorySettings(builder));
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

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
  private readonly ICurrentUserService _currentUserService;

  public BasicAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    ISystemClock clock,
    ICurrentUserService currentUserService
  )
    : base(options, logger, encoder, clock)
  {
    _currentUserService = currentUserService;
  }

  protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
  {
    if (!Request.Headers.ContainsKey("Authorization"))
    {
      return AuthenticateResult.Fail("Missing Authorization Header");
    }

    try
    {
      AuthenticationHeaderValue authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
      byte[] credentialBytes = Convert.FromBase64String(authHeader.Parameter);
      string username = Encoding.UTF8.GetString(credentialBytes);

      _currentUserService.SetUserName("heiri");

      var claims = new[]
      {
        new Claim(ClaimTypes.NameIdentifier, username),
        new Claim(ClaimTypes.Name, username)
      };

      var identity = new ClaimsIdentity(claims, Scheme.Name);
      var principal = new ClaimsPrincipal(identity);
      var ticket = new AuthenticationTicket(principal, Scheme.Name);
      return AuthenticateResult.Success(ticket);
    }
    catch
    {
      return AuthenticateResult.Fail("Invalid Authorization Header");
    }
  }
}
