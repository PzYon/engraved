using System.Threading.Tasks;
using Metrix.Core.Application.Commands.Measurements.Add.Counter;
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
  public async Task Throw_WhenMetricKeyIsNotSpecified()
  {
    var command = new AddCounterMeasurementCommand { MetricKey = string.Empty };

    await new AddCounterMeasurementCommandExecutor(command).Execute(_testDb, new FakeDateService());
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public async Task Throw_WhenMetricDoesNotExist()
  {
    var command = new AddCounterMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s"
    };

    await new AddCounterMeasurementCommandExecutor(command).Execute(_testDb, new FakeDateService());
  }
}
