using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Move;

public class MoveEntryCommandExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IDateService dateService
)
  : ICommandExecutor<MoveEntryCommand>
{
  public async Task<CommandResult> Execute(MoveEntryCommand command)
  {
    // can user access target journal?
    IJournal? targetJournal = await journalRepository.GetJournal(command.TargetJournalId);
    if (targetJournal == null)
    {
      return new CommandResult();
    }

    // can user access entry?
    IEntry? entry = await entryRepository.GetEntry(command.EntryId);
    if (entry == null)
    {
      return new CommandResult();
    }

    // update source journal EditedOn
    IJournal sourceJournal = (await journalRepository.GetJournal(entry.ParentId))!;
    sourceJournal.EditedOn = dateService.UtcNow;
    await journalRepository.UpsertJournal(sourceJournal);

    // update target journal EditedOn
    targetJournal.EditedOn = dateService.UtcNow;
    await journalRepository.UpsertJournal(targetJournal);

    // update entry
    entry.EditedOn = dateService.UtcNow;
    entry.DateTime = dateService.UtcNow;
    entry.ParentId = targetJournal.Id!;
    await entryRepository.UpsertEntry(entry);

    // use the source journal loaded above: entry.ParentId already points to the target here,
    // so re-loading via the entry would wrongly derive both sides from the target journal.
    string[] affectedUserIds = targetJournal.Permissions.GetUserIdsWithAccess()
      .Union(sourceJournal.Permissions.GetUserIdsWithAccess())
      .ToArray();

    return new CommandResult(
      command.EntryId,
      affectedUserIds
    );
  }
}
