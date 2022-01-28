using Metrix.Core.Domain;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Tests;

[TestClass]
public class MetricsLoaderTest
{
  [TestMethod]
  public void TestMethod1()
  {
    var provider = new DummyMetricsLoader();
    Assert.IsNotNull(provider.GetMetrics());
  }
}