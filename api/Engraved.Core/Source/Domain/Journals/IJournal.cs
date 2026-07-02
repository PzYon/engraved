using System.Text.Json.Serialization;
using Engraved.Core.Domain.Permissions;

namespace Engraved.Core.Domain.Journals;

public enum ThresholdScope
{
  Day,
  Month,
  All
}

public class ThresholdDefinition
{
  public double Value { get; set; }
  public ThresholdScope Scope {get; set;}
}

// The derived types are registered for System.Text.Json so that values declared as IJournal
// (e.g. controller responses and nested properties) are serialized with all properties of
// their runtime type - including ones not on this interface, like BaseJournal.UserRole.
// No type discriminator is emitted, so the JSON shape is unchanged.
[JsonDerivedType(typeof(CounterJournal))]
[JsonDerivedType(typeof(GaugeJournal))]
[JsonDerivedType(typeof(TimerJournal))]
[JsonDerivedType(typeof(ScrapsJournal))]
[JsonDerivedType(typeof(LogBookJournal))]
public interface IJournal : IUserOwned, IPermissionHolder, IEntity
{
  string Name { get; set; }

  string? Description { get; set; }

  string? Notes { get; set; }

  JournalType Type { get; }

  Dictionary<string, JournalAttribute> Attributes { get; set; }

  Dictionary<string, Dictionary<string, ThresholdDefinition>> Thresholds { get; set; }

  // basic idea here is to enable clients to store whatever they want while
  // the server is completely unaware of what's going on here. i.e. server
  // does not know, what he's actually storing. this way there's also no
  // server side serialization required, etc.
  Dictionary<string, string> CustomProps { get; set; }
}
