using System.Text.Json.Serialization;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Domain;

// System.Text.Json resolves polymorphism config from the declared type, so all concrete
// journal and entry types are registered here as well for values declared as IEntity
// (e.g. SearchResultEntity.Entity). See IEntry/IJournal for details.
[JsonDerivedType(typeof(CounterEntry))]
[JsonDerivedType(typeof(GaugeEntry))]
[JsonDerivedType(typeof(TimerEntry))]
[JsonDerivedType(typeof(ScrapsEntry))]
[JsonDerivedType(typeof(LogBookEntry))]
[JsonDerivedType(typeof(CounterJournal))]
[JsonDerivedType(typeof(GaugeJournal))]
[JsonDerivedType(typeof(TimerJournal))]
[JsonDerivedType(typeof(ScrapsJournal))]
[JsonDerivedType(typeof(LogBookJournal))]
public interface IEntity : IEditable, IScheduled
{
  string? Id { get; set; }
}
