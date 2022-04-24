using System.Threading.Tasks;
using Metrix.Core.Domain.Metrics;
using MongoDB.Driver;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

public class TestMongoDbSettings : IDatabaseSettings
{
  public string MongoConnectionString => "mongodb://localhost:27017";
  public string DatabaseName => "metrix_test";
  public string MetricCollectionName => "metrics";
  public string MeasurementCollectionName => "measurements";
}

public class MongoDbShould
{
  private MongoDb _db = null!;

  [SetUp]
  public void Setup()
  {
    var settings = new TestMongoDbSettings();
    var client = new MongoClient(settings.MongoConnectionString);
    client.DropDatabase(settings.DatabaseName);

    _db = new MongoDb(new TestMongoDbSettings());
  }

  [Test]
  public async Task GetAllMetrics_Empty()
  {
    IMetric[] allMetrics = await _db.GetAllMetrics();

    Assert.AreEqual(allMetrics.Length, 0);
  }

  [Test]
  public async Task CreateOneMetric_Then_GetMetric()
  {
    await _db.AddMetric(new CounterMetric { Key = "Foo" });

    IMetric? metric = await _db.GetMetric("Foo");

    Assert.IsNotNull(metric);
  }

  [Test]
  public async Task CreateMetrics_Then_GetAllMetrics()
  {
    await _db.AddMetric(new CounterMetric { Key = "Foo" });
    await _db.AddMetric(new CounterMetric { Key = "Bar" });

    IMetric[] allMetrics = await _db.GetAllMetrics();

    Assert.AreEqual(allMetrics.Length, 2);
  }
}
