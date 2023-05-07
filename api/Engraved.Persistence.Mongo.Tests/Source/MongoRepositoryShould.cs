using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;
using Engraved.Core.Domain.User;
using Newtonsoft.Json;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

// consider using Commands and Queries here to improve data consistency and 
// have a more end-to-end view, e.g. something like this:
// await new AddCounterMeasurementCommand().CreateExecutor().Execute(_repository, null);

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

    counterMetric = (CounterMetric?) await _repository.GetMetric(result.EntityId);

    Assert.IsNotNull(counterMetric);

    counterMetric!.Name = "Second";
    await _repository.UpsertMetric(counterMetric);

    IMetric? updateMetric = await _repository.GetMetric(result.EntityId);
    Assert.IsNotNull(updateMetric);
    Assert.AreEqual(counterMetric.Id, updateMetric!.Id);
    Assert.AreEqual(counterMetric.Name, updateMetric.Name);
  }

  [Test]
  public async Task CreateMetric_WithAttributes()
  {
    var counterMetric = new CounterMetric
    {
      Name = "First",
      Attributes = new Dictionary<string, MetricAttribute>
      {
        {
          "flags",
          new MetricAttribute
          {
            Name = "Random Values",
            Values = { { "fl@g", "fl@g_value" } }
          }
        }
      }
    };

    UpsertResult result = await _repository.UpsertMetric(counterMetric);

    IMetric? metric = await _repository.GetMetric(result.EntityId);
    Assert.IsNotNull(metric);
    Assert.IsNotNull(metric!.Attributes);

    Assert.Contains("flags", metric.Attributes.Keys);
    MetricAttribute attribute = metric.Attributes["flags"];
    Assert.Contains("fl@g", attribute.Values.Keys);
    Assert.AreEqual("fl@g_value", attribute.Values["fl@g"]);
  }

  [Test]
  public async Task CreateMeasurements_Then_GetAll()
  {
    var metric = new GaugeMetric { Name = "N@me" };
    UpsertResult result = await _repository.UpsertMetric(metric);

    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = result.EntityId, Value = 123 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = "wrongId", Value = 456 });
    await _repository.UpsertMeasurement(new GaugeMeasurement { MetricId = result.EntityId, Value = 789 });

    IMeasurement[] allMeasurements = await _repository.GetAllMeasurements(result.EntityId, null, null, null);

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

  [Test]
  public async Task Persist_UiSettings()
  {
    string value = JsonConvert.SerializeObject(new Dictionary<string, object> { { "simpleSetting", true } });

    var metric = new GaugeMetric
    {
      Name = "N@me",
      CustomProps = new Dictionary<string, string> { { "uiSettings", value } }
    };

    UpsertResult result = await _repository.UpsertMetric(metric);
    IMetric reloadedMetric = (await _repository.GetMetric(result.EntityId))!;

    Assert.IsTrue(reloadedMetric.CustomProps.ContainsKey("uiSettings"));
    Assert.AreEqual(reloadedMetric.CustomProps["uiSettings"], value);
  }
}
