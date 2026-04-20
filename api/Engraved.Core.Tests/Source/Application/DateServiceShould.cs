using System;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application;

public class DateServiceShould
{
  [Test]
  public void SetUtcDate_WhenUpdateDateIsCalled()
  {
    var service = new DateService();

    service.UpdateDate();

    service.UtcNow.Kind.Should().Be(DateTimeKind.Utc);
  }
}
