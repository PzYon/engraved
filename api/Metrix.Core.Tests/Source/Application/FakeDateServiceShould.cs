using System;
using NUnit.Framework;

namespace Metrix.Core.Application;

public class FakeDateServiceShould
{
  private const int TotalSteps = 100;

  [Test]
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

    for (var i = 0; i < TotalSteps; i++)
    {
      service.SetNext(TotalSteps - i);

      DateTime nextNow = service.UtcNow;

      Assert.IsTrue(nextNow > lastNow);
      Assert.IsTrue(nextNow < DateTime.UtcNow);

      lastNow = nextNow;
    }
  }
}
