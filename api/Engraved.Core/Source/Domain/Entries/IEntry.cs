using System.Text.Json.Serialization;

namespace Engraved.Core.Domain.Entries;

// The derived types are registered for System.Text.Json so that values declared as IEntry
// (e.g. controller responses and nested properties) are serialized with all properties of
// their runtime type. No type discriminator is emitted, so the JSON shape is unchanged.
[JsonDerivedType(typeof(CounterEntry))]
[JsonDerivedType(typeof(GaugeEntry))]
[JsonDerivedType(typeof(TimerEntry))]
[JsonDerivedType(typeof(ScrapsEntry))]
[JsonDerivedType(typeof(LogBookEntry))]
public interface IEntry : IUserOwned, IEntity
{
  string ParentId { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  Dictionary<string, string[]> JournalAttributeValues { get; set; }

  double GetValue();
}
