using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Measurements.Move;

public class MoveMeasurementCommandExecutorShould
{
  private InMemoryRepository _repo = null!;
  private FakeDateService _dateService = null!;

  [SetUp]
  public void SetUp()
  {
    _repo = new InMemoryRepository();
    _dateService = new FakeDateService(DateTime.UtcNow.AddDays(-10));
  }

  [Test]
  public async Task MoveMeasurementToOtherMetric()
  {
    // given: source
    _repo.Metrics.Add(new CounterMetric { Id = "source-metric-id" });
    _repo.Measurements.Add(
      new CounterMeasurement
      {
        Id = "measurement-id",
        MetricId = "source-metric-id",
        DateTime = _dateService.UtcNow
      }
    );
    IMeasurement[] sourceMeasurements = await _repo.GetAllMeasurements("source-metric-id", null, null, null);
    Assert.AreEqual(1, sourceMeasurements.Length);

    // given: target
    _repo.Metrics.Add(new CounterMetric { Id = "target-metric-id" });
    IMeasurement[] targetMeasurements = await _repo.GetAllMeasurements("target-metric-id", null, null, null);
    Assert.AreEqual(0, targetMeasurements.Length);

    // when
    await new MoveMeasurementCommandExecutor(
      new MoveMeasurementCommand
      {
        MeasurementId = "measurement-id",
        TargetMetricId = "target-metric-id"
      }
    ).Execute(_repo, _dateService);

    // then
    targetMeasurements = await _repo.GetAllMeasurements("target-metric-id", null, null, null);
    Assert.AreEqual(1, targetMeasurements.Length);

    sourceMeasurements = await _repo.GetAllMeasurements("source-metric-id", null, null, null);
    Assert.AreEqual(0, sourceMeasurements.Length);
  }
}
