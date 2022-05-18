using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.User;
using MongoDB.Bson;
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
    UpsertResult result = await _repository.UpsertMetric(new CounterMetric());

    IMetric? metric = await _repository.GetMetric(result.EntityId);

    Assert.IsNotNull(metric);
  }

  [Test]
  public async Task CreateMetrics_Then_GetAllMetrics()
  {
    await _repository.UpsertMetric(new CounterMetric());
    await _repository.UpsertMetric(new CounterMetric());

    IMetric[] allMetrics = await _repository.GetAllMetrics();

    Assert.AreEqual(allMetrics.Length, 2);
  }

  [Test]
  public async Task CreateMetric_Then_Update()
  {
    var counterMetric = new CounterMetric { Name = "First" };
    UpsertResult result = await _repository.UpsertMetric(counterMetric);

    counterMetric = (CounterMetric)await _repository.GetMetric(result.EntityId);

    Assert.IsNotNull(counterMetric);

    counterMetric!.Name = "Second";
    await _repository.UpsertMetric(counterMetric);

    IMetric? updateMetric = await _repository.GetMetric(result.EntityId);
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

    UpsertResult result = await _repository.UpsertMetric(counterMetric);

    IMetric? metric = await _repository.GetMetric(result.EntityId);
    Assert.IsNotNull(metric);
    Assert.IsNotNull(metric!.Flags);
    Assert.Contains("fl@g", metric.Flags.Keys);
    Assert.AreEqual("fl@g_value", metric.Flags["fl@g"]);
  }

  [Test]
  public async Task GetAllMeasurements_Empty()
  {
    IMeasurement[] allMetrics = await _repository.GetAllMeasurements(ObjectId.GenerateNewId().ToString());

    Assert.AreEqual(allMetrics.Length, 0);
  }

  [Test]
  public async Task CreateMeasurements_Then_GetAll()
  {
    var timerMetric = new GaugeMetric { Name = "N@me" };
    UpsertResult result = await _repository.UpsertMetric(timerMetric);

    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = result.EntityId, Value = 123 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = "wrongId", Value = 456 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = result.EntityId, Value = 789 });

    IMeasurement[] allMeasurements = await _repository.GetAllMeasurements(result.EntityId);

    Assert.AreEqual(2, allMeasurements.Length);
  }

  [Test]
  public async Task Not_CreateUser_WithSameName()
  {
    await _repository.UpsertUser(new User { Name = "schorsch" });

    Assert.ThrowsAsync<ArgumentException>(
      async () => await _repository.UpsertUser(new User { Name = "schorsch" })
    );
  }
}
