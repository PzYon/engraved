using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;
using Engraved.Persistence.Mongo.DocumentTypes.Measurements;
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
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "Beta", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindMeasurements_IgnoringCase()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "beta", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindMeasurements_MultipleWords()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "beta gam", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindMeasurements_NonConsecutiveWords()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { _metricId }, "alpha gam", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task Consider_ScrapsTitle()
  {
    var metric = new ScrapsMetric { Name = "My Scrap" };
    UpsertResult result = await _repository.UpsertMetric(metric);

    await _repository.UpsertMeasurement(
      new ScrapsMeasurement { MetricId = result.EntityId, ScrapType = ScrapType.List, Title = "Heiri" }
    );
    await _repository.UpsertMeasurement(
      new ScrapsMeasurement { MetricId = result.EntityId, ScrapType = ScrapType.List, Title = "Franz" }
    );

    IMeasurement[] results = await _repository.GetLastEditedMeasurements(new[] { result.EntityId }, "heiri", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(((ScrapsMeasurement)results[0]).Title, "Heiri");
  }

  [Test]
  public async Task Consider_MetricTypes_Negative()
  {
    IMeasurement[] results = await _repository.GetLastEditedMeasurements(
      null,
      null,
      new[] { MetricType.Counter },
      10
    );

    Assert.AreEqual(0, results.Length);
  }

  [Test]
  public async Task Consider_MetricTypes_Positive()
  {
    var metric = new ScrapsMetric { Name = "My Scrap" };
    UpsertResult result = await _repository.UpsertMetric(metric);

    await _repository.UpsertMeasurement(
      new ScrapsMeasurement { MetricId = result.EntityId, ScrapType = ScrapType.List, Title = "Heiri" }
    );

    IMeasurement[] results = await _repository.GetLastEditedMeasurements(
      null,
      null,
      new[] { MetricType.Scraps },
      10
    );

    Assert.AreEqual(1, results.Length);
    Assert.IsTrue(results[0] is ScrapsMeasurement);
  }
}
