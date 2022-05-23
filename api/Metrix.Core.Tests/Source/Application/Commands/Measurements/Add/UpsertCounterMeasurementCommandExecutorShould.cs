using Metrix.Core.Application.Commands.Measurements.Add.Counter;
using NUnit.Framework;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class UpsertCounterMeasurementCommandExecutorShould
{
  private TestRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new TestRepository();
  }

  [Test]
  public void Throw_WhenMetricKeyIsNotSpecified()
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
