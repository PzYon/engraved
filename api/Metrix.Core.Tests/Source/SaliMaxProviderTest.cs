using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Tests;

[TestClass]
public class SaliMaxProviderTest
{
  [TestMethod]
  public void TestMethod1()
  {
    var provider = new SaliMaxProvider();
    Assert.IsNotNull(provider.GetSaliMax().Date);
  }
}