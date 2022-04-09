using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Application;

[TestClass]
public class FakeDateServiceShould
{
  private readonly int totalSteps = 100;

  [TestMethod]
  public void IncrementAndBeGreaterThanLastAndBeSmallerThanRealUtcNow()
  {
    for (var i = 0; i < 100; i++)
    {
      ExecuteTest(i);
    }
  }

  private void ExecuteTest(int incrementation)
  {
    var service = new FakeDateService(DateTime.UtcNow.AddDays(-(incrementation + 1) * 20));

    DateTime lastNow = service.UtcNow;

    for (var i = 0; i < totalSteps; i++)
    {
      service.SetNext(totalSteps - i);

      DateTime nextNow = service.UtcNow;

      Assert.IsTrue(nextNow > lastNow);
      Assert.IsTrue(nextNow < DateTime.UtcNow);

      lastNow = nextNow;
    }
  }
}
