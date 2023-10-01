using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommandExecutor : ICommandExecutor
{
  private readonly DeleteJournalCommand _command;

  public DeleteJournalCommandExecutor(DeleteJournalCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    IJournal? journal = await repository.GetJournal(_command.JournalId);
    if (journal == null)
    {
      return new CommandResult();
    }

    await repository.DeleteJournal(_command.JournalId);

    return new CommandResult(_command.JournalId, journal.Permissions.GetUserIdsWithAccess());
  }
}
