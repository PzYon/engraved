using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Filters;
using Engraved.Api.Settings;
using Engraved.Api.Temp;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo;
using Engraved.Search.Lucene;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Dispatcher = Engraved.Core.Application.Dispatcher;

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
builder.Services.AddTransient<Lazy<IUser>>(
  provider => provider.GetService<IUserScopedRepository>()!.CurrentUser
);
builder.Services.AddMemoryCache();
builder.Services.AddTransient<QueryCache>();
builder.Services.AddTransient<Dispatcher>();

builder.Services.AddTransient<ISearchIndex, LuceneSearchIndex>();
LuceneSearchIndex.WakeUp();

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

builder.Services.AddTransient<Engraved.Api.Temp.Dispatcher>();
builder.Services.AddTransient<IQueryExecutor<string[], FooQuery>, FooQueryExecutor>();

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

IUserScopedRepository GetMongoDbUserScopedRepo(
  WebApplicationBuilder webApplicationBuilder,
  ICurrentUserService userService
)
{
  return new UserScopedMongoRepository(CreateRepositorySettings(webApplicationBuilder), userService);
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
  return new MongoRepository(CreateRepositorySettings(builder));
}

void SeedRepo(IRepository repo)
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
