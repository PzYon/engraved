using System.Threading.Tasks;
using Metrix.Core.Domain.Metrics;
using MongoDB.Driver;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

[Ignore("Requires local MongoDB.")]
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

  [Test]
  public async Task CreateMetric_Then_Update()
  {
    var counterMetric = new CounterMetric { Key = "Foo", Name = "First" };
    await _repository.AddMetric(counterMetric);

    counterMetric.Name = "Second";
    await _repository.UpdateMetric(counterMetric);

    IMetric? updateMetric = await _repository.GetMetric(counterMetric.Key);
    Assert.IsNotNull(updateMetric);
    Assert.AreEqual(counterMetric.Key, updateMetric!.Key);
    Assert.AreEqual(counterMetric.Name, updateMetric.Name);
  }
}
