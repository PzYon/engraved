using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Move;

public class MoveEntryCommandExecutor : ICommandExecutor<MoveEntryCommand>
{
  private readonly IRepository _repository;
  private readonly IDateService _dateService;

  public MoveEntryCommandExecutor(IRealRepository repository, IDateService dateService)
  {
    _repository = repository;
    _dateService = dateService;
  }

  public async Task<CommandResult> Execute(MoveEntryCommand command)
  {
    // can user access target journal?
    IJournal? targetJournal = await _repository.GetJournal(command.TargetJournalId);
    if (targetJournal == null)
    {
      return new CommandResult();
    }

    // can user access entry?
    IEntry? entry = await _repository.GetEntry(command.EntryId);
    if (entry == null)
    {
      return new CommandResult();
    }

    // update source journal EditedOn
    IJournal sourceJournal = (await _repository.GetJournal(entry.ParentId))!;
    sourceJournal.EditedOn = _dateService.UtcNow;
    await _repository.UpsertJournal(sourceJournal);

    // update target journal EditedOn
    targetJournal.EditedOn = _dateService.UtcNow;
    await _repository.UpsertJournal(targetJournal);

    // update entry
    entry.EditedOn = _dateService.UtcNow;
    entry.DateTime = _dateService.UtcNow;
    entry.ParentId = targetJournal.Id!;
    await _repository.UpsertEntry(entry);

    string[] affectedUserIds = await GetAffectedUserIds(_repository, entry, targetJournal);

    return new CommandResult(
      command.EntryId,
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
