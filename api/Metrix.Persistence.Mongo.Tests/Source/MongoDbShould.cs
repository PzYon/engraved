using System.Threading.Tasks;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using MongoDB.Driver;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

// consider using Commands and Queries here to improve data consistency and 
// have a more end-to-end view, e.g. something like this:
// await new AddCounterMeasurementCommand().CreateExecutor().Execute(_repository, null);

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
    await _repository.AddMetric(new CounterMetric {Key = "Foo"});

    IMetric? metric = await _repository.GetMetric("Foo");

    Assert.IsNotNull(metric);
  }

  [Test]
  public async Task CreateMetrics_Then_GetAllMetrics()
  {
    await _repository.AddMetric(new CounterMetric {Key = "Foo"});
    await _repository.AddMetric(new CounterMetric {Key = "Bar"});

    IMetric[] allMetrics = await _repository.GetAllMetrics();

    Assert.AreEqual(allMetrics.Length, 2);
  }

  [Test]
  public async Task CreateMetric_Then_Update()
  {
    var counterMetric = new CounterMetric {Key = "Foo", Name = "First"};
    await _repository.AddMetric(counterMetric);

    counterMetric.Name = "Second";
    await _repository.UpdateMetric(counterMetric);

    IMetric? updateMetric = await _repository.GetMetric(counterMetric.Key);
    Assert.IsNotNull(updateMetric);
    Assert.AreEqual(counterMetric.Key, updateMetric!.Key);
    Assert.AreEqual(counterMetric.Name, updateMetric.Name);
  }

  [Test]
  public async Task GetAllMeasurements_Empty()
  {
    IMeasurement[] allMetrics = await _repository.GetAllMeasurements("metricKey");

    Assert.AreEqual(allMetrics.Length, 0);
  }

  [Test]
  public async Task CreateMeasurements_Then_GetAll()
  {
    var timerMetric = new GaugeMetric
    {
      Key = "k3y",
      Name = "N@me"
    };

    await _repository.AddMetric(timerMetric);

    await _repository.AddMeasurement(new GaugeMeasurement {MetricKey = "k3y", Value = 123});
    await _repository.AddMeasurement(new GaugeMeasurement {MetricKey = "k3y", Value = 321});

    IMeasurement[] allMeasurements = await _repository.GetAllMeasurements("metricKey");

    Assert.AreEqual(allMeasurements.Length, 2);
  }
}
