using System.Text;
using System.Text.Json.Serialization;
using Metrix.Api;
using Metrix.Api.Controllers;
using Metrix.Api.Filters;
using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;
using Metrix.Core.Domain.User;
using Metrix.Persistence.Mongo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
  .AddControllers(options => options.Filters.Add<HttpExceptionFilter>())
  .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IUserStore<IUser>, UserStore>();
builder.Services.AddIdentityCore<IUser>();

// custom dependencies
builder.Services.AddSingleton(_ => GetRepository(builder));
builder.Services.AddTransient<IDateService, DateService>();
builder.Services.AddTransient<Dispatcher>();

builder.Services.AddAuthentication(
    x =>
    {
      x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }
  )
  .AddJwtBearer(
    x =>
    {
      x.RequireHttpsMetadata = false;
      x.SaveToken = true;
      x.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AuthController.Secret)),
        ValidateIssuer = false,
        ValidateAudience = false
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
  IRepository repository = webApplicationBuilder.Environment.IsDevelopment()
    ? GetInMemoryRepo()
    : GetMongoDbRepo();

  return repository;
}

IRepository GetInMemoryRepo()
{
  IRepository repo = new InMemoryRespository();

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
