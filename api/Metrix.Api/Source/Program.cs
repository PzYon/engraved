using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Metrix.Api.Authentication;
using Metrix.Api.Authentication.Google;
using Metrix.Api.Filters;
using Metrix.Api.Settings;
using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;
using Metrix.Core.Domain.User;
using Metrix.Persistence.Mongo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
builder.Services.AddSingleton(_ => UseInMemoryRepo() ? GetInMemoryRepo() : GetMongoDbRepo());
builder.Services.AddTransient(
  provider =>
  {
    var userService = provider.GetService<ICurrentUserService>()!;
    return UseInMemoryRepo()
      ? GetInMemoryUserScopedRepo(provider.GetService<IRepository>()!, userService)
      : GetMongoDbUserScopedRepo(builder, userService);
  }
);
builder.Services.AddTransient<Dispatcher>();

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
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
          Encoding.ASCII.GetBytes(authConfigSection.GetValue<string>(nameof(AuthenticationConfig.JwtSecret)))
        ),
        ValidateIssuer = false,
        ValidateAudience = false
      };
      options.Events = new JwtBearerEvents
      {
        OnTokenValidated = context =>
        {
          var jwtToken = (JwtSecurityToken) context.SecurityToken;
          Claim nameClaim = jwtToken.Claims.First(c => c.Type == "nameid");

          context.HttpContext.RequestServices
            .GetRequiredService<ICurrentUserService>()
            .SetUserName(nameClaim.Value);

          return Task.CompletedTask;
        }
      };
    }
  );

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
  return false;
  // return builder.Environment.IsDevelopment();
}

IUserScopedRepository GetMongoDbUserScopedRepo(
  WebApplicationBuilder webApplicationBuilder,
  ICurrentUserService userService
  )
{
  string? connectionString = webApplicationBuilder.Configuration.GetConnectionString("metrix_db");
  return new UserScopedMongoRepository(new MongoRepositorySettings(connectionString), userService);
}

IUserScopedRepository GetInMemoryUserScopedRepo(IRepository repository, ICurrentUserService userService)
{
  var repo = new UserScopedInMemoryRepository(repository, userService);

  if (!isSeeded)
  {
    SeedRepo(repo);
    isSeeded = true;
  }

  return repo;
}

IRepository GetInMemoryRepo()
{
  IRepository repo = new InMemoryRepository();
  SeedRepo(repo);
  return repo;
}

IRepository GetMongoDbRepo()
{
  string? connectionString = builder.Configuration.GetConnectionString("metrix_db");
  return new MongoRepository(new MongoRepositorySettings(connectionString));
}

void SeedRepo(IRepository repo)
{
  Task seed = new DemoDataRepositorySeeder(repo).Seed();
  if (!seed.IsCompleted)
  {
    seed.Wait();
  }
}
