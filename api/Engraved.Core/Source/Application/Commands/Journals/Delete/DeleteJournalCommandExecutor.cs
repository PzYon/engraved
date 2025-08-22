using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Notifications;

namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommandExecutor(IRepository repository)
  : ICommandExecutor<DeleteJournalCommand>
{
  public async Task<CommandResult> Execute(DeleteJournalCommand command)
  {
    IJournal? journal = await repository.GetJournal(command.JournalId);
    if (journal == null)
    {
      return new CommandResult();
    }

    await repository.DeleteJournal(command.JournalId);

    return new CommandResult(command.JournalId, journal.Permissions.GetUserIdsWithAccess());
  }
}
