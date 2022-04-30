using System;
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
    await _repository.AddMetric(new CounterMetric());

    IMetric? metric = await _repository.GetMetric(null);

    Assert.IsNotNull(metric);
  }

  [Test]
  public async Task CreateMetrics_Then_GetAllMetrics()
  {
    await _repository.AddMetric(new CounterMetric { Id = "626dc92c4f598ca9fc09c3c4" });
    await _repository.AddMetric(new CounterMetric { Id = "626dc93b91c44b5a20f9ea27" });

    IMetric[] allMetrics = await _repository.GetAllMetrics();

    Assert.AreEqual(allMetrics.Length, 2);
  }

  [Test]
  public async Task CreateMetric_Then_Update()
  {
    var counterMetric = new CounterMetric { Name = "First" };
    await _repository.AddMetric(counterMetric);

    throw new Exception("We need metric id down below");

    counterMetric = (CounterMetric)await _repository.GetMetric(counterMetric.Id);

    Assert.IsNotNull(counterMetric);

    counterMetric!.Name = "Second";
    await _repository.UpdateMetric(counterMetric);

    IMetric? updateMetric = await _repository.GetMetric(counterMetric.Id);
    Assert.IsNotNull(updateMetric);
    Assert.AreEqual(counterMetric.Id, updateMetric!.Id);
    Assert.AreEqual(counterMetric.Name, updateMetric.Name);
  }

  [Test]
  public async Task CreateMetric_WithFlags()
  {
    var counterMetric = new CounterMetric
    {
      Name = "First",
      Flags = new Dictionary<string, string> { { "fl@g", "fl@g_value" } }
    };

    await _repository.AddMetric(counterMetric);

    IMetric? metric = await _repository.GetMetric(counterMetric.Id);
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
    const string metricId = "626dab25f1a93c5c724d820a";
    var timerMetric = new GaugeMetric
    {
      Id = metricId,
      Name = "N@me"
    };

    await _repository.AddMetric(timerMetric);

    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = metricId, Value = 123 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = "wrongId", Value = 456 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = metricId, Value = 789 });

    IMeasurement[] allMeasurements = await _repository.GetAllMeasurements(metricId);

    Assert.AreEqual(2, allMeasurements.Length);
  }
}
