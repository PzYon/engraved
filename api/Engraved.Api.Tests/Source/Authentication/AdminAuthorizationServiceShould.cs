using Engraved.Api.Authentication;
using Engraved.Api.Settings;
using FluentAssertions;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace Engraved.Api.Tests.Authentication;

public class AdminAuthorizationServiceShould
{
  [TestCase("admin@x.com", "admin@x.com,other@x.com", true)]
  [TestCase("ADMIN@x.com", "admin@x.com", true, TestName = "{m}_IsCaseInsensitive")]
  [TestCase(" admin@x.com ", "admin@x.com", false, TestName = "{m}_DoesNotTrimTheUserName")]
  [TestCase("nobody@x.com", "admin@x.com,other@x.com", false)]
  [TestCase("admin@x.com", "", false)]
  [TestCase("admin@x.com", null, false)]
  [TestCase(null, "admin@x.com", false)]
  public void DetermineAdminStatus_FromCommaSeparatedAllowlist(
    string? userName,
    string? configuredEmails,
    bool expected
  )
  {
    var service = new AdminAuthorizationService(Options.Create(new AdminConfig { Emails = configuredEmails }));

    service.IsAdmin(userName).Should().Be(expected);
  }

  [Test]
  public void TrimWhitespace_AroundConfiguredEmails()
  {
    var service = new AdminAuthorizationService(
      Options.Create(new AdminConfig { Emails = " admin@x.com , other@x.com " })
    );

    service.IsAdmin("admin@x.com").Should().BeTrue();
    service.IsAdmin("other@x.com").Should().BeTrue();
  }
}
