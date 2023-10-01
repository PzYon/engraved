using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertEntryCommand : ICommand
{
  public string? Id { get; set; }

  public string JournalId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public Dictionary<string, string[]> JournalAttributeValues { get; set; } = new();

  public abstract ICommandExecutor CreateExecutor();

  public abstract JournalType GetSupportedJournalType();
}
