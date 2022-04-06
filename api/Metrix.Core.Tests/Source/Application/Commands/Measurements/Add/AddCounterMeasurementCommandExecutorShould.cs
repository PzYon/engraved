using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class AddCounterMeasurementCommandExecutorShould
{
  private TestDb _testDb = null!;

  [TestInitialize]
  public void SetUp()
  {
    _testDb = new TestDb();
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricKeyIsNotSpecified()
  {
    var command = new AddCounterMeasurementCommand { MetricKey = string.Empty };

    new AddCounterMeasurementCommandExecutor(command).Execute(_testDb);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public void Throw_WhenMetricDoesNotExist()
  {
    var command = new AddCounterMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s"
    };

    new AddCounterMeasurementCommandExecutor(command).Execute(_testDb);
  }
}
