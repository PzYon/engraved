using Metrix.Core.Domain;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Custom services
builder.Services.AddTransient<IMeasurementsStore>(_ =>
{
  // we inject a (static) list here to simulate our DB
  return new MeasurementsStore(DummyData.Measurements);
});

builder.Services.AddTransient<IMetricsStore>(_ =>
{
  // we inject a (static) list here to simulate our DB
  return new MetricsStore(DummyData.Metrics);
});

var app = builder.Build();

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
