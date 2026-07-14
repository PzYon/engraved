using System;
using Engraved.Core.Application;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application;

public class DateServiceShould
{
  [Test]
  public void ProvideUtcDate()
  {
    var service = new DateService();

    service.UtcNow.Kind.Should().Be(DateTimeKind.Utc);
  }
}
