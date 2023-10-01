using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Move;

public class MoveEntryCommandExecutor : ICommandExecutor
{
  private readonly MoveEntryCommand _command;

  public MoveEntryCommandExecutor(MoveEntryCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    // can user access target journal?
    IJournal? targetJournal = await repository.GetJournal(_command.TargetJournalId);
    if (targetJournal == null)
    {
      return new CommandResult();
    }

    // can user access entry?
    IEntry? entry = await repository.GetEntry(_command.EntryId);
    if (entry == null)
    {
      return new CommandResult();
    }

    // update source journal EditedOn
    IJournal sourceJournal = (await repository.GetJournal(entry.ParentId))!;
    sourceJournal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(sourceJournal);

    // update target journal EditedOn
    targetJournal.EditedOn = dateService.UtcNow;
    await repository.UpsertJournal(targetJournal);

    // update entry
    entry.EditedOn = dateService.UtcNow;
    entry.DateTime = dateService.UtcNow;
    entry.ParentId = targetJournal.Id!;
    await repository.UpsertEntry(entry);

    string[] affectedUserIds = await GetAffectedUserIds(repository, entry, targetJournal);

    return new CommandResult(
      _command.EntryId,
      affectedUserIds
    );
  }

  private static async Task<string[]> GetAffectedUserIds(
    IRepository repository,
    IEntry entry,
    IJournal targetJournal
  )
  {
    IJournal sourceJournal = (await repository.GetJournal(entry.ParentId))!;

    return targetJournal.Permissions.GetUserIdsWithAccess()
      .Union(sourceJournal.Permissions.GetUserIdsWithAccess())
      .Distinct()
      .ToArray();
  }
}
