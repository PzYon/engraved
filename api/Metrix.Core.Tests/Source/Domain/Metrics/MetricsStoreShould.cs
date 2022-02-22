using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Domain.Metrics;

[TestClass]
public class MetricsStoreShould
{
  private IMetricsStore store;

  [TestInitialize]
  public void SetUp()
  {
    store = new MetricsStore(new List<Metric>());
  }

  [TestMethod]
  public void GetAll()
  {
    Assert.IsNotNull(store.GetAll());
  }

  [TestMethod]
  public void Add()
  {
    var metricKey = "k3y";

    store.Add(new Metric { Key = metricKey });

    Metric retrievedMetric = store.Get(metricKey);

    Assert.IsNotNull(retrievedMetric);
    Assert.AreEqual(metricKey, retrievedMetric.Key);
  }
}
