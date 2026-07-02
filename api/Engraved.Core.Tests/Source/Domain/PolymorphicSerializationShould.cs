using System.Text.Json;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Domain;

// System.Text.Json serializes based on the DECLARED type, so without the [JsonDerivedType]
// registrations on IEntry/IJournal/IEntity, values declared as these interfaces (controller
// responses and nested properties) would silently lose all runtime-type-specific properties.
// These tests pin that the registrations exist and no type discriminator leaks into the JSON.
public class PolymorphicSerializationShould
{
  private static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web);

  [Test]
  public void SerializeRuntimeTypeProperties_ForValueDeclaredAsIEntry()
  {
    IEntry entry = new GaugeEntry { Value = 42 };

    string json = JsonSerializer.Serialize(entry, Options);

    json.Should().Contain("\"value\":42");
  }

  [Test]
  public void SerializeRuntimeTypeProperties_ForElementsOfIEntryArray()
  {
    IEntry[] entries = [new ScrapsEntry { Title = "my scrap" }];

    string json = JsonSerializer.Serialize(entries, Options);

    json.Should().Contain("\"title\":\"my scrap\"");
  }

  [Test]
  public void SerializeRuntimeTypeProperties_ForValueDeclaredAsIJournal()
  {
    IJournal journal = new GaugeJournal { Name = "my journal", UserRole = UserRole.Owner };

    string json = JsonSerializer.Serialize(journal, Options);

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

    string json = JsonSerializer.Serialize(searchResult, Options);

    json.Should().Contain("\"title\":\"found scrap\"");
  }

  [Test]
  public void NotEmitTypeDiscriminator()
  {
    IEntry entry = new GaugeEntry { Value = 42 };

    string json = JsonSerializer.Serialize(entry, Options);

    // the client relies on the existing JSON shape; the derived types are
    // deliberately registered without discriminator ids
    json.Should().NotContain("$type");
  }
}
