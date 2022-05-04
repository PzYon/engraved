using System.Text.Json.Serialization;
using Metrix.Api.Filters;
using Metrix.Core.Application;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
  .AddControllers(options => options.Filters.Add<HttpExceptionFilter>())
  .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Custom services
builder.Services.AddSingleton(
  _ =>
  {
    //IRepository repository = new MongoRepository(new MongoRepositorySettings());
    IRepository repository = new InMemoryRespository();
    Task seed = new DemoDataRepositorySeeder(repository).Seed();
    if (!seed.IsCompleted)
    {
      seed.Wait();
    }

    return repository;
  }
);

builder.Services.AddTransient<IDateService, DateService>();
builder.Services.AddTransient<Dispatcher>();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(policyBuilder => policyBuilder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();

app.Run();
