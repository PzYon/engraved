using System;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application;

public class DateServiceShould
{
  [Test]
  public void ProvideUtcDate()
  {
    var service = new DateService();

    service.UtcNow.Kind.Should().Be(DateTimeKind.Utc);
  }
}
