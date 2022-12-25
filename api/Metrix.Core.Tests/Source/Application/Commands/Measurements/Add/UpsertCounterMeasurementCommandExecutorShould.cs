using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Commands.Measurements.Add.Counter;
using Metrix.Core.Application.Commands.Measurements.Add.Gauge;
using Metrix.Core.Application.Commands.Measurements.Upsert.Counter;
using Metrix.Core.Application.Commands.Measurements.Upsert.Gauge;
using Metrix.Core.Application.Persistence.Demo;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class UpsertCounterMeasurementCommandExecutorShould
{
  private InMemoryRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new InMemoryRepository();
  }

  [Test]
  public async Task CreateNew()
  {
    _testRepository.Metrics.Add(new CounterMetric { Id = "metric_id" });

    var command = new UpsertCounterMeasurementCommand { MetricId = "metric_id", Notes = "foo" };
    await new UpsertCounterMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);
    Assert.AreEqual("foo", _testRepository.Measurements.First().Notes);
  }

  [Test]
  public async Task UpdateExisting()
  {
    _testRepository.Metrics.Add(new GaugeMetric { Id = "metric_id" });

    var createCommand = new UpsertGaugeMeasurementCommand { MetricId = "metric_id", Notes = "foo", Value = 123 };
    CommandResult result =
      await new UpsertGaugeMeasurementCommandExecutor(createCommand).Execute(_testRepository, new FakeDateService());

    var updateCommand = new UpsertGaugeMeasurementCommand
    {
      Id = result.EntityId,
      MetricId = "metric_id",
      Notes = "bar",
      Value = 42
    };

    await new UpsertGaugeMeasurementCommandExecutor(updateCommand).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);
    Assert.AreEqual("bar", _testRepository.Measurements.First().Notes);
    Assert.AreEqual(42, _testRepository.Measurements.OfType<GaugeMeasurement>().First().Value);
  }

  [Test]
  public void Throw_WhenMetricIdIsNotSpecified()
  {
    var command = new UpsertCounterMeasurementCommand { MetricId = string.Empty };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertCounterMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }

  [Test]
  public void Throw_WhenMetricDoesNotExist()
  {
    var command = new UpsertCounterMeasurementCommand
    {
      MetricId = "k3y",
      Notes = "n0t3s"
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertCounterMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }
}
