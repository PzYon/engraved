using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Metrix.Api.Authentication;
using Metrix.Api.Controllers;
using Metrix.Api.Filters;
using Metrix.Api.Settings;
using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;
using Metrix.Persistence.Mongo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
  .AddControllers(options => options.Filters.Add<HttpExceptionFilter>())
  .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<ICurrentUserService, CurrentUserService>();
IConfigurationSection authConfigSection = builder.Configuration.GetSection("Authentication");
builder.Services.Configure<AuthenticationConfig>(authConfigSection);
builder.Services.AddTransient<TokenTranslator>();
builder.Services.AddSingleton(_ => GetRepository(builder));
builder.Services.AddTransient<IDateService, DateService>();
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
          var jwtToken = (JwtSecurityToken)context.SecurityToken;
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

// Configure the HTTP request pipeline.
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

IRepository GetRepository(WebApplicationBuilder webApplicationBuilder)
{
  return webApplicationBuilder.Environment.IsDevelopment()
    ? GetInMemoryRepo()
    : GetMongoDbRepo();
}

IRepository GetInMemoryRepo()
{
  IRepository repo = new InMemoryRepository();

  Task seed = new DemoDataRepositorySeeder(repo).Seed();
  if (!seed.IsCompleted)
  {
    seed.Wait();
  }

  return repo;
}

IRepository GetMongoDbRepo()
{
  var connectionString = builder.Configuration.GetConnectionString("metrix_db");
  return new MongoRepository(new MongoRepositorySettings(connectionString));
}
