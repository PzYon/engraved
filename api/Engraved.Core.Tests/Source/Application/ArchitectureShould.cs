using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Engraved.Core.Application.Persistence;
using FluentAssertions;
using NetArchTest.Rules;
using NUnit.Framework;

namespace Engraved.Core.Application;

// Guards the Core <-> persistence boundary: Engraved.Core owns the persistence abstractions but must
// never depend on a concrete database. Pins the "keep Core free of MongoDB" acceptance criterion
// from #2877 so the boundary cannot silently regress.
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

  private static string Describe(IEnumerable<string>? failingTypeNames)
  {
    return string.Join(", ", failingTypeNames ?? Enumerable.Empty<string>());
  }
}
