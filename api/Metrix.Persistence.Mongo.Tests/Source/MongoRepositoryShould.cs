using System.Collections.Generic;
using System.Threading.Tasks;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

// consider using Commands and Queries here to improve data consistency and 
// have a more end-to-end view, e.g. something like this:
// await new AddCounterMeasurementCommand().CreateExecutor().Execute(_repository, null);

//[Ignore("Requires local MongoDB.")]
public class MongoRepositoryShould
{
  private MongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
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

    counterMetric = (CounterMetric)await _repository.GetMetric(counterMetric.Key);

    Assert.IsNotNull(counterMetric);

    counterMetric!.Name = "Second";
    await _repository.UpdateMetric(counterMetric);

    IMetric? updateMetric = await _repository.GetMetric(counterMetric.Key);
    Assert.IsNotNull(updateMetric);
    Assert.AreEqual(counterMetric.Key, updateMetric!.Key);
    Assert.AreEqual(counterMetric.Name, updateMetric.Name);
  }

  [Test]
  public async Task CreateMetric_WithFlags()
  {
    var counterMetric = new CounterMetric
    {
      Key = "Foo",
      Name = "First",
      Flags = new Dictionary<string, string> { { "fl@g", "fl@g_value" } }
    };

    await _repository.AddMetric(counterMetric);

    IMetric? metric = await _repository.GetMetric(counterMetric.Key);
    Assert.IsNotNull(metric);
    Assert.IsNotNull(metric!.Flags);
    Assert.Contains("fl@g", metric.Flags.Keys);
    Assert.AreEqual("fl@g_value", metric.Flags["fl@g"]);
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
    const string metricKey = "k3y";

    var timerMetric = new GaugeMetric
    {
      Id = "626dab25f1a93c5c724d820a",
      Key = metricKey,
      Name = "N@me"
    };

    await _repository.AddMetric(timerMetric);

    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricKey = metricKey, Value = 123 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricKey = "wrongKey", Value = 456 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricKey = metricKey, Value = 789 });

    IMeasurement[] allMeasurements = await _repository.GetAllMeasurements(metricKey);

    Assert.AreEqual(2, allMeasurements.Length);
  }
}
