using System;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Engraved.Api;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Api.Tests;

// System.Text.Json serializes based on the DECLARED type, so without the DomainPolymorphism
// configuration for IEntry/IJournal/IEntity, values declared as these interfaces (controller
// responses and nested properties) would silently lose all runtime-type-specific properties.
// These tests pin that the reflection-based discovery works and no type discriminator leaks
// into the JSON. Uses the same resolver setup as the MVC pipeline in Program.cs.
public class PolymorphicSerializationShould
{
  private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
  {
    TypeInfoResolver = new DefaultJsonTypeInfoResolver
    {
      Modifiers = { DomainPolymorphism.ConfigurePolymorphism }
    }
  };

  [Test]
  public void SerializeRuntimeTypeProperties_ForValueDeclaredAsIEntry()
  {
    IEntry entry = new GaugeEntry { Value = 42 };

    var json = JsonSerializer.Serialize(entry, Options);

    json.Should().Contain("\"value\":42");
  }

  [Test]
  public void SerializeRuntimeTypeProperties_ForElementsOfIEntryArray()
  {
    IEntry[] entries = [new ScrapsEntry { Title = "my scrap" }];

    var json = JsonSerializer.Serialize(entries, Options);

    json.Should().Contain("\"title\":\"my scrap\"");
  }

  [Test]
  public void SerializeRuntimeTypeProperties_ForValueDeclaredAsIJournal()
  {
    IJournal journal = new GaugeJournal { Name = "my journal", UserRole = UserRole.Owner };

    var json = JsonSerializer.Serialize(journal, Options);

    // UserRole is defined on BaseJournal but not on IJournal, so it proves
    // the runtime type (and not just the interface) is serialized.
    json.Should().Contain("\"userRole\":");
    json.Should().Contain("\"type\":");
  }

  [Test]
  public void SerializeRuntimeTypeProperties_ForValueDeclaredAsIEntity()
  {
    var searchResult = new SearchResultEntity
    {
      EntityType = EntityType.Entry,
      Entity = new ScrapsEntry { Title = "found scrap" }
    };

    var json = JsonSerializer.Serialize(searchResult, Options);

    json.Should().Contain("\"title\":\"found scrap\"");
  }

  [Test]
  public void DiscoverAllConcreteTypes_ViaReflection()
  {
    var entryTypes = DomainPolymorphism.GetDerivedTypes(typeof(IEntry));
    var journalTypes = DomainPolymorphism.GetDerivedTypes(typeof(IJournal));
    var entityTypes = DomainPolymorphism.GetDerivedTypes(typeof(IEntity));

    entryTypes.Should()
      .Contain(
        new[]
        {
          typeof(CounterEntry), typeof(GaugeEntry), typeof(TimerEntry), typeof(ScrapsEntry), typeof(LogBookEntry)
        }
      );
    journalTypes.Should()
      .Contain(
        new[]
        {
          typeof(CounterJournal), typeof(GaugeJournal), typeof(TimerJournal), typeof(ScrapsJournal),
          typeof(LogBookJournal)
        }
      );
    entityTypes.Should().Contain(entryTypes).And.Contain(journalTypes);

    // non-polymorphic types are not configured
    DomainPolymorphism.GetDerivedTypes(typeof(string)).Should().BeEmpty();
  }

  [Test]
  public void NotEmitTypeDiscriminator()
  {
    IEntry entry = new GaugeEntry { Value = 42 };

    var json = JsonSerializer.Serialize(entry, Options);

    // the client relies on the existing JSON shape; the derived types are
    // deliberately registered without discriminator ids
    json.Should().NotContain("$type");
  }
}
