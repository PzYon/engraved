using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertEntryCommand : ICommand
{
  public string? Id { get; set; }

  public string JournalId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  // Always the full list the entry should end up with, never a delta: leaving one out removes it
  // from the entry. What is believed of each item is decided by FileAcceptor.
  public FileRef[] Files { get; set; } = [];

  public Dictionary<string, string[]> JournalAttributeValues { get; set; } = new();

  public abstract JournalType GetSupportedJournalType();
}
