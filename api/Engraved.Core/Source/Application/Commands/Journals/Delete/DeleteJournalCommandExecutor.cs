using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommandExecutor(
  IJournalRepository journalRepository,
  IEntryRepository entryRepository,
  IFileStore fileStore
)
  : ICommandExecutor<DeleteJournalCommand>
{
  public async Task<CommandResult> Execute(DeleteJournalCommand command)
  {
    IJournal? journal = await journalRepository.GetJournal(command.JournalId);
    if (journal == null)
    {
      return new CommandResult();
    }

    // Collected before the entries go: DeleteEntriesForJournal is a bulk delete that never loads
    // them, so afterwards there is nothing left to learn the file ids from.
    var fileIds = await entryRepository.GetFileIdsForJournal(command.JournalId);

    // a journal's entries die with it - this cascade is a use-case rule and therefore lives here,
    // not in the repository
    await entryRepository.DeleteEntriesForJournal(command.JournalId);
    await journalRepository.DeleteJournal(command.JournalId);

    // After the documents are gone, for the same reason as in DeleteEntryCommandExecutor: this order
    // fails towards an unreferenced blob rather than towards an entry pointing at a missing file.
    foreach (var fileId in fileIds)
    {
      await fileStore.Delete(fileId);
    }

    return new CommandResult(command.JournalId, journal.Permissions.GetUserIdsWithAccess());
  }
}
