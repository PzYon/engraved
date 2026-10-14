using System;
using Engraved.Api.Settings;
using FluentAssertions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using NUnit.Framework;

namespace Engraved.Api.Tests;

public class E2ETestModeShould
{
  [Test]
  public void BeRequested_When_ArgumentIsPassed_OutsideProduction()
  {
    E2ETestMode.IsRequested(["--urls", "http://localhost:5072", "e2e-tests"], HostEnvironment("E2ETests"))
      .Should()
      .BeTrue();
  }

  [Test]
  public void NotBeRequested_When_ArgumentIsMissing()
  {
    E2ETestMode.IsRequested(["--urls", "http://localhost:5072"], HostEnvironment(Environments.Production))
      .Should()
      .BeFalse();
  }

  [Test]
  public void Throw_When_ArgumentIsPassed_InProduction()
  {
    Action request = () => E2ETestMode.IsRequested(["e2e-tests"], HostEnvironment(Environments.Production));

    request.Should().Throw<InvalidOperationException>().WithMessage("*e2e-tests*Production*");
  }

  private static HostingEnvironment HostEnvironment(string name)
  {
    return new HostingEnvironment { EnvironmentName = name };
  }
}
