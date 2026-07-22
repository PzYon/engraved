using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertEntryCommand : ICommand
{
  public string? Id { get; set; }

  // true when the client created this entry itself (with a client-generated Id), e.g. while
  // offline. Only such commands may materialize a new entry under an explicit Id; an update whose
  // entry no longer exists is discarded instead of resurrecting the deleted entry.
  public bool IsNew { get; set; }

  public string JournalId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public Dictionary<string, string[]> JournalAttributeValues { get; set; } = new();

  public abstract JournalType GetSupportedJournalType();
}
