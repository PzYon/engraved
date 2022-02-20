using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Domain;

[TestClass]
public class MetricsStoreShould
{
  private IMetricsStore store;

  [TestInitialize]
  public void SetUp()
  {
    store = new DummyMetricsStore();
  }

  [TestMethod]
  public void GetMetrics()
  {
    Assert.IsNotNull(store.GetMetrics());
  }

  [TestMethod]
  public void CreateNewMetric()
  {
    var metricKey = "k3y";

    store.Create(new Metric { Key = metricKey });

    Metric retrievedMetric = store.GetMetric(metricKey);

    Assert.IsNotNull(retrievedMetric);
    Assert.AreEqual(metricKey, retrievedMetric.Key);
  }
}
