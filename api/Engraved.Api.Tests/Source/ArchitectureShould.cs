using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Engraved.Core.Application.Persistence;
using FluentAssertions;
using NetArchTest.Rules;
using NUnit.Framework;

namespace Engraved.Api;

// Guards the Api side of the unrestricted persistence seam. The unrestricted seam is deliberately
// greppable so that bypassing permission scoping is always a conscious choice (see
// IUnrestrictedRepository). Only the composition root and the handful of consumers that run without a
// current user (auth/login, health) may touch it; a new accidental consumer (e.g. a feature
// controller) must fail this test and force a deliberate allowlist edit.
public class ArchitectureShould
{
  private static readonly Assembly ApiAssembly = typeof(Program).Assembly;

  [Test]
  public void OnlyLetAllowedConsumersTouchTheUnrestrictedSeam()
  {
    string[] allowedConsumers =
    [
      "Program", // composition root: wires the seam up via DI
      "RootController", // health endpoint, runs before any user context
      "WakeMeUpController", // keep-alive, runs without a user
      "UserLoader", // authentication, runs before a user context exists
      "LoginHandler", // login, runs before a user context exists
      "RefreshTokenService" // token refresh, runs before a user context exists
    ];

    IEnumerable<string> actualConsumers = Types.InAssembly(ApiAssembly)
      .That()
      .HaveDependencyOn(typeof(IUnrestrictedRepository).FullName)
      .GetTypes()
      .Select(type => type.Name);

    actualConsumers.Should().BeSubsetOf(
      allowedConsumers,
      "only sanctioned consumers in Engraved.Api may depend on the unrestricted persistence seam"
    );
  }
}
