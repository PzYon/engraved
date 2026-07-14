using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutor(
  IEntryRepository entryRepository,
  IJournalRepository journalRepository,
  IDateService dateService
)
  : ICommandExecutor<DeleteEntryCommand>
{
  public async Task<CommandResult> Execute(DeleteEntryCommand command)
  {
    IEntry? entry = await entryRepository.GetEntry(command.Id);
    if (entry == null)
    {
      return new CommandResult();
    }

    await entryRepository.DeleteEntry(command.Id);

    IJournal journal = (await journalRepository.GetJournal(entry.ParentId))!;
    journal.EditedOn = dateService.UtcNow;

    await journalRepository.UpsertJournal(journal);

    return new CommandResult(command.Id, journal.Permissions.GetUserIdsWithAccess());
  }
}
