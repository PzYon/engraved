using System.Threading.Tasks;
using Engraved.Core.Domain.Metrics;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_GetAllMetrics_Should
{
  private MongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    var gauge = new GaugeMetric { Name = "Gauge", Description = "G@ug3 Description" };
    await _repository.UpsertMetric(gauge);

    var counter = new CounterMetric { Name = "Counter", Description = "Count3r Description" };
    await _repository.UpsertMetric(counter);

    var timer = new TimerMetric { Name = "Timer", Description = "Tim3r Description" };
    await _repository.UpsertMetric(timer);
  }

  [Test]
  public async Task ReturnAllMetrics_WithEmptyQuery()
  {
    IMetric[] results = await _repository.GetAllMetrics();
    Assert.AreEqual(3, results.Length);
  }
  
  [Test]
  public async Task ReturnLimitedMetrics()
  {
    IMetric[] results = await _repository.GetAllMetrics(null, 1);
    Assert.AreEqual(1, results.Length);
  }
  
  [Test]
  public async Task Return_Matching_Name()
  {
    IMetric[] results = await _repository.GetAllMetrics("gauge");
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual("Gauge", results[0].Name);
  }
  
  [Test]
  public async Task Return_Matching_Description()
  {
    IMetric[] results = await _repository.GetAllMetrics("tim3r");
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual("Timer", results[0].Name);
  }
  
  [Test]
  public async Task Return_Matching_MetricTypes()
  {
    IMetric[] results = await _repository.GetAllMetrics(null, null, new[] { MetricType.Timer, MetricType.Gauge } );
    Assert.AreEqual(2, results.Length);
  }
}
