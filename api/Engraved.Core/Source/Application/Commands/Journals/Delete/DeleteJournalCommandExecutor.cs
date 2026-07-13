using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Notifications;

namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommandExecutor(IJournalRepository journalRepository, IEntryRepository entryRepository)
  : ICommandExecutor<DeleteJournalCommand>
{
  public async Task<CommandResult> Execute(DeleteJournalCommand command)
  {
    IJournal? journal = await journalRepository.GetJournal(command.JournalId);
    if (journal == null)
    {
      return new CommandResult();
    }

    // a journal's entries die with it - this cascade is a use-case rule and therefore lives here,
    // not in the repository
    await entryRepository.DeleteEntriesForJournal(command.JournalId);
    await journalRepository.DeleteJournal(command.JournalId);

    return new CommandResult(command.JournalId, journal.Permissions.GetUserIdsWithAccess());
  }
}
