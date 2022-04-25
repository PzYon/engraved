using System.Threading.Tasks;
using Metrix.Core.Domain.Metrics;
using MongoDB.Driver;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

public class TestMongoRepositorySettings : IMongoRepositorySettings
{
  public string MongoDbConnectionString => "mongodb://localhost:27017";
  public string DatabaseName => "metrix_test";
  public string MetricsCollectionName => "metrics";
  public string MeasurementsCollectionName => "measurements";
}

public class MongoDbShould
{
  private MongoRepository _repository = null!;

  [SetUp]
  public void Setup()
  {
    var settings = new TestMongoRepositorySettings();
    var client = new MongoClient(settings.MongoDbConnectionString);
    client.DropDatabase(settings.DatabaseName);

    _repository = new MongoRepository(new TestMongoRepositorySettings());
  }

  [Test]
  public async Task GetAllMetrics_Empty()
  {
    IMetric[] allMetrics = await _repository.GetAllMetrics();

    Assert.AreEqual(allMetrics.Length, 0);
  }

  [Test]
  public async Task CreateOneMetric_Then_GetMetric()
  {
    await _repository.AddMetric(new CounterMetric { Key = "Foo" });

    IMetric? metric = await _repository.GetMetric("Foo");

    Assert.IsNotNull(metric);
  }

  [Test]
  public async Task CreateMetrics_Then_GetAllMetrics()
  {
    await _repository.AddMetric(new CounterMetric { Key = "Foo" });
    await _repository.AddMetric(new CounterMetric { Key = "Bar" });

    IMetric[] allMetrics = await _repository.GetAllMetrics();

    Assert.AreEqual(allMetrics.Length, 2);
  }
}
