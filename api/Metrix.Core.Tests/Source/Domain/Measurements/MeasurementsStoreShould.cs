using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Domain.Measurements;

[TestClass]
public class MeasurementsStoreShould
{
  private IMeasurementsStore store;

  [TestInitialize]
  public void SetUp()
  {
    store = new MeasurementsStore();
  }

  [TestMethod]
  public void AddMeasurement()
  {
    var metricKey = "m3tr1k3y";
    var value = 43.34;

    store.AddMeasurement(new Measurement
    {
      MetricKey = metricKey,
      Value = value
    });

    var m = store.GetMeasurements(metricKey).FirstOrDefault(m => m.Value == value);
    Assert.IsNotNull(m);
    Assert.AreEqual(value, m.Value);
    Assert.AreEqual(metricKey, m.MetricKey);
  }
}
