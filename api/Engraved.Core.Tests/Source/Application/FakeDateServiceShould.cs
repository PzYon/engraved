using System;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application;

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

      nextNow.Should().BeAfter(lastNow);
      nextNow.Should().BeBefore(DateTime.UtcNow);

      lastNow = nextNow;
    }
  }
}
