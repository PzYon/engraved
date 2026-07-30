using System;
using Engraved.Storage.Azure;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Storage.Azure.Tests;

// The rounding is what makes a signed URL cacheable: if the expiry moved with every request, the
// signature - and therefore the whole URL - would differ each time, and the browser would re-download
// every image on every render.
public class SasExpiryShould
{
  [Test]
  public void Round_UpToTheNextFullHour()
  {
    DateTimeOffset expiry = SasExpiry.GetReadExpiry(At(10, 05));

    expiry.Should().Be(At(11, 00));
  }

  [Test]
  public void Return_TheSameExpiry_For_RequestsWithinTheSameWindow()
  {
    SasExpiry.GetReadExpiry(At(10, 01))
      .Should()
      .Be(SasExpiry.GetReadExpiry(At(10, 44)));
  }

  [Test]
  public void Never_Return_AnExpiryThatIsAlmostUp()
  {
    // 10:59 + the 15 minute minimum lands in the next hour, so it rounds to 12:00 rather than
    // handing out a URL with one minute of life left
    DateTimeOffset expiry = SasExpiry.GetReadExpiry(At(10, 59));

    expiry.Should().Be(At(12, 00));
    (expiry - At(10, 59)).Should().BeGreaterThan(TimeSpan.FromMinutes(15));
  }

  [Test]
  public void Return_AnExpiry_AtLeast_FifteenMinutesAway_ForEveryMinuteOfTheHour()
  {
    for (var minute = 0; minute < 60; minute++)
    {
      DateTimeOffset now = At(10, minute);

      (SasExpiry.GetReadExpiry(now) - now).Should().BeGreaterThanOrEqualTo(TimeSpan.FromMinutes(15));
    }
  }

  private static DateTimeOffset At(int hour, int minute)
  {
    return new DateTimeOffset(2026, 7, 27, hour, minute, 0, TimeSpan.Zero);
  }
}
