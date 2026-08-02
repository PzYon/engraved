using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutor(
  IEntryRepository entryRepository,
  IJournalRepository journalRepository,
  IFileStore fileStore,
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

    // Deliberately after the entry is gone: the two cannot be one atomic operation, and this order
    // fails towards an unreferenced blob - which the store's lifecycle rules sweep up - rather than
    // towards an entry pointing at a file that no longer exists.
    await DeleteFiles(entry.Files.Select(f => f.Id));

    IJournal journal = (await journalRepository.GetJournal(entry.ParentId))!;
    journal.EditedOn = dateService.UtcNow;

    await journalRepository.UpsertJournal(journal);

    return new CommandResult(command.Id, journal.Permissions.GetUserIdsWithAccess());
  }

  private async Task DeleteFiles(IEnumerable<string> fileIds)
  {
    foreach (var fileId in fileIds)
    {
      await fileStore.Delete(fileId);
    }
  }
}
