using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Engraved.Core.Application.Persistence;
using FluentAssertions;
using NetArchTest.Rules;
using NUnit.Framework;

namespace Engraved.Core.Application;

// Guards the architectural boundaries Engraved.Core is supposed to hold. Engraved.Core owns the
// persistence abstractions and the domain, but must stay free of any concrete infrastructure, keep
// its inner Domain ring clean, and never leak the unrestricted persistence seam. These tests pin
// invariants from #2877 so they cannot silently regress.
public class ArchitectureShould
{
  // any type from the Core assembly anchors the assembly under test
  private static readonly Assembly CoreAssembly = typeof(IJournalRepository).Assembly;

  [Test]
  public void NotDependOnMongoDb()
  {
    TestResult result = Types.InAssembly(CoreAssembly)
      .ShouldNot()
      .HaveDependencyOn("MongoDB")
      .GetResult();

    result.IsSuccessful.Should().BeTrue(
      "Engraved.Core must not depend on MongoDB. Offending types: {0}",
      Describe(result.FailingTypeNames)
    );
  }

  [Test]
  public void NotDependOnTheMongoPersistenceImplementation()
  {
    TestResult result = Types.InAssembly(CoreAssembly)
      .ShouldNot()
      .HaveDependencyOn("Engraved.Persistence.Mongo")
      .GetResult();

    result.IsSuccessful.Should().BeTrue(
      "Engraved.Core must not depend on the Mongo persistence implementation. Offending types: {0}",
      Describe(result.FailingTypeNames)
    );
  }

  [Test]
  public void NotDependOnTheWebFramework()
  {
    // Core is the framework-agnostic domain/application layer: it must not reach into ASP.NET Core.
    // Anything that needs the web host belongs in Engraved.Api.
    TestResult result = Types.InAssembly(CoreAssembly)
      .ShouldNot()
      .HaveDependencyOn("Microsoft.AspNetCore")
      .GetResult();

    result.IsSuccessful.Should().BeTrue(
      "Engraved.Core must not depend on the web framework (Microsoft.AspNetCore). Offending types: {0}",
      Describe(result.FailingTypeNames)
    );
  }

  [Test]
  public void KeepTheDomainRingFreeOfApplication()
  {
    // Domain is the innermost ring (entities, permissions, the JournalAccessPolicy rule). It must not
    // depend on the Application layer above it (executors, queries, repository abstractions); the
    // dependency only flows Application -> Domain.
    TestResult result = Types.InAssembly(CoreAssembly)
      .That()
      .ResideInNamespace("Engraved.Core.Domain")
      .ShouldNot()
      .HaveDependencyOn("Engraved.Core.Application")
      .GetResult();

    result.IsSuccessful.Should().BeTrue(
      "Engraved.Core.Domain must not depend on Engraved.Core.Application. Offending types: {0}",
      Describe(result.FailingTypeNames)
    );
  }

  [Test]
  public void OnlyLetSanctionedConsumersTouchTheUnrestrictedSeam()
  {
    // The unrestricted seam is deliberately greppable so that bypassing permission scoping is always a
    // conscious choice (see IUnrestrictedRepository). Within Core, only the notification job - which
    // legitimately runs across all users with no current user - may depend on it. A new accidental
    // consumer (e.g. an executor) must fail this test and force a deliberate allowlist edit.
    string[] sanctionedConsumers = ["NotificationJob"];

    IEnumerable<string> actualConsumers = Types.InAssembly(CoreAssembly)
      .That()
      .HaveDependencyOn(typeof(IUnrestrictedRepository).FullName)
      .GetTypes()
      .Select(type => type.Name);

    actualConsumers.Should().BeSubsetOf(
      sanctionedConsumers,
      "only sanctioned consumers in Engraved.Core may depend on the unrestricted persistence seam"
    );
  }

  private static string Describe(IEnumerable<string>? failingTypeNames)
  {
    return string.Join(", ", failingTypeNames ?? Enumerable.Empty<string>());
  }
}
