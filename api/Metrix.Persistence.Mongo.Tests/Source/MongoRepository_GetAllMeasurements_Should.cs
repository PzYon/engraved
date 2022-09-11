using System;
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
  private string _userId = MongoUtil.GenerateNewIdAsString();

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
  public async Task Consider_ToDate()
  {
    string measurementId = await AddMeasurement(DateTime.Now.AddDays(-1));
    await AddMeasurement(DateTime.Now.AddDays(1));

    IMeasurement[] measurements = await _repository.GetAllMeasurements(_metricId, null, DateTime.Now, null);

    Assert.AreEqual(1, measurements.Length);
    Assert.AreEqual(measurementId, measurements.First().Id);
  }

  private async Task<string> AddMeasurement(DateTime? date)
  {
    var measurement = new CounterMeasurement
    {
      MetricId = _metricId,
      UserId = _userId,
      DateTime = date
    };

    UpsertResult result = await _repository.UpsertMeasurement(measurement);

    return result.EntityId;
  }
}
