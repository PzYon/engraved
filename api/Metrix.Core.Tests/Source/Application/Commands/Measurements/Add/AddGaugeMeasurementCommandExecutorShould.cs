using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Commands.Measurements.Add.Gauge;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application.Commands.Measurements.Add;

[TestClass]
public class AddGaugeMeasurementCommandExecutorShould
{
  private TestRepository _testRepository = null!;

  [TestInitialize]
  public void SetUp()
  {
    _testRepository = new TestRepository();
  }

  [TestMethod]
  [DataRow(0)]
  [DataRow(1)]
  [DataRow(123.456)]
  public async Task Set_ValueFromCommand(double value)
  {
    _testRepository.Metrics.Add(new GaugeMetric { Key = "k3y" });

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Value = value
    };

    await new AddGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);

    var counterMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.AreEqual(value, counterMeasurement.Value);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public async Task Throw_WhenNoValueIsSpecified()
  {
    _testRepository.Metrics.Add(new GaugeMetric { Key = "k3y" });

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = null
    };

    await new AddGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
  }

  [TestMethod]
  public async Task MapAllFieldsCorrectly()
  {
    _testRepository.Metrics.Add(
      new GaugeMetric
      {
        Key = "k3y",
        Flags = { { "x", "y" }, { "k3y", "v@lue" } }
      }
    );

    const double value = 123.45;

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = value,
      MetricFlagKey = "k3y"
    };

    await new AddGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.MetricKey, createdMeasurement.MetricKey);
    Assert.AreEqual(command.Notes, createdMeasurement.Notes);
    Assert.AreEqual(command.MetricFlagKey, createdMeasurement.MetricFlagKey);

    var gaugeMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(gaugeMeasurement);
    Assert.AreEqual(value, gaugeMeasurement.Value);
  }

  [TestMethod]
  [ExpectedException(typeof(InvalidCommandException))]
  public async Task Throw_WhenMetricFlagKeyDoesNotExistOnMetric()
  {
    _testRepository.Metrics.Add(new GaugeMetric { Key = "k3y" });

    var command = new AddGaugeMeasurementCommand
    {
      MetricKey = "k3y",
      Notes = "n0t3s",
      Value = 42,
      MetricFlagKey = "fooBar"
    };

    await new AddGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
  }
}
