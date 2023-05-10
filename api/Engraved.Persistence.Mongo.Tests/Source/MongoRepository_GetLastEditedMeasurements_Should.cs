using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_GetLastEditedMeasurements_Should
{
  private MongoRepository _repository = null!;

  private string _metricId = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    var metric = new GaugeMetric { Name = "Test" };
    UpsertResult result = await _repository.UpsertMetric(metric);

    _metricId = result.EntityId;

    await _repository.UpsertMeasurement(
      new GaugeMeasurement { MetricId = result.EntityId, Value = 1, Notes = "Lorem ipsum dolor" }
    );
    await _repository.UpsertMeasurement(
      new GaugeMeasurement { MetricId = result.EntityId, Value = 2, Notes = "Alpha Beta Gamma" }
    );
    await _repository.UpsertMeasurement(
      new GaugeMeasurement { MetricId = result.EntityId, Value = 3, Notes = "Heiri Herbert Hans" }
    );
  }

  [Test]
  public async Task FindMeasurements()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "Beta", 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindMeasurements_IgnoringCase()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "beta", 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindMeasurements_MultipleWords()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "beta gam", 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindMeasurements_NonConsecutiveWords()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "alpha gam", 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }
}
