using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

public class MongoRepository_GetAllMeasurements_Should
{
  private MongoRepository _repository = null!;
  private string _metricId = null!;
  private readonly string _userId = MongoUtil.GenerateNewIdAsString();

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    UpsertResult upsertMetric = await _repository.UpsertMetric(new CounterMetric());
    _metricId = upsertMetric.EntityId;
  }

  [Test]
  public async Task Return_Empty()
  {
    IMeasurement[] measurements = await _repository.GetAllMeasurements(_metricId, null, null, null);

    Assert.AreEqual(0, measurements.Length);
  }

  [Test]
  public async Task Consider_ToDate()
  {
    string measurementId = await AddMeasurement(DateTime.Now.AddDays(-1));
    await AddMeasurement(DateTime.Now.AddDays(1));

    IMeasurement[] measurements = await _repository.GetAllMeasurements(_metricId, null, DateTime.Now, null);

    Assert.AreEqual(1, measurements.Length);
    Assert.AreEqual(measurementId, measurements.First().Id);
  }

  [Test]
  public async Task Consider_FromDate()
  {
    await AddMeasurement(DateTime.Now.AddDays(-1));
    string measurementId = await AddMeasurement(DateTime.Now.AddDays(1));

    IMeasurement[] measurements = await _repository.GetAllMeasurements(_metricId, DateTime.Now, null, null);

    Assert.AreEqual(1, measurements.Length);
    Assert.AreEqual(measurementId, measurements.First().Id);
  }

  [Test]
  public async Task Consider_FromAndToDate_Negative()
  {
    await AddMeasurement(DateTime.Now.AddDays(-10));
    await AddMeasurement(DateTime.Now.AddDays(10));

    IMeasurement[] measurements = await _repository.GetAllMeasurements(
      _metricId,
      DateTime.Now.AddDays(-1),
      DateTime.Now.AddDays(1),
      null
    );

    Assert.AreEqual(0, measurements.Length);
  }

  [Test]
  public async Task Consider_FromAndToDate_Positive()
  {
    await AddMeasurement(DateTime.Now.AddDays(-2));
    await AddMeasurement(DateTime.Now.AddDays(2));

    IMeasurement[] measurements = await _repository.GetAllMeasurements(
      _metricId,
      DateTime.Now.AddDays(-5),
      DateTime.Now.AddDays(5),
      null
    );

    Assert.AreEqual(2, measurements.Length);
  }

  [Test]
  public async Task Consider_Simple_AttributeValue_Positive()
  {
    var attributeValues = new Dictionary<string, string[]> { { "attr", new[] { "xyz" } } };

    await AddMeasurement(DateTime.Now, attributeValues);

    IMeasurement[] measurements = await _repository.GetAllMeasurements(
      _metricId,
      null,
      null,
      attributeValues
    );

    Assert.AreEqual(1, measurements.Length);
  }

  [Test]
  public async Task Consider_Simple_AttributeValue_Negative()
  {
    var attributeValues = new Dictionary<string, string[]> { { "attr", new[] { "xyz" } } };

    await AddMeasurement(DateTime.Now, attributeValues);

    IMeasurement[] measurements = await _repository.GetAllMeasurements(
      _metricId,
      null,
      null,
      new Dictionary<string, string[]> { { "attr", new[] { "abc" } } }
    );

    Assert.AreEqual(0, measurements.Length);
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_OnSource_Positive()
  {
    var attributeValues = new Dictionary<string, string[]>
    {
      { "color", new[] { "blue" } },
      { "size", new[] { "XL" } }
    };

    await AddMeasurement(DateTime.Now, attributeValues);

    IMeasurement[] measurements = await _repository.GetAllMeasurements(
      _metricId,
      null,
      null,
      new Dictionary<string, string[]> { { "size", new[] { "XL" } } }
    );

    Assert.AreEqual(1, measurements.Length);
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_InQuery_Negative()
  {
    var attributeValues = new Dictionary<string, string[]>
    {
      { "size", new[] { "XL" } }
    };

    await AddMeasurement(DateTime.Now, attributeValues);

    IMeasurement[] measurements = await _repository.GetAllMeasurements(
      _metricId,
      null,
      null,
      new Dictionary<string, string[]>
      {
        { "size", new[] { "XL" } }, { "color", new[] { "blue" } },
      }
    );

    Assert.AreEqual(0, measurements.Length);
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_Or()
  {
    var attributeValues = new Dictionary<string, string[]>
    {
      { "size", new[] { "XL" } }
    };

    await AddMeasurement(DateTime.Now, attributeValues);

    IMeasurement[] measurements = await _repository.GetAllMeasurements(
      _metricId,
      null,
      null,
      new Dictionary<string, string[]> { { "size", new[] { "XL", "L" } } }
    );

    Assert.AreEqual(1, measurements.Length);
  }

  private async Task<string> AddMeasurement(DateTime? date, Dictionary<string, string[]> attributeValues = null)
  {
    var measurement = new CounterMeasurement
    {
      MetricId = _metricId,
      UserId = _userId,
      DateTime = date,
      MetricAttributeValues = attributeValues
    };

    UpsertResult result = await _repository.UpsertMeasurement(measurement);

    return result.EntityId;
  }
}
