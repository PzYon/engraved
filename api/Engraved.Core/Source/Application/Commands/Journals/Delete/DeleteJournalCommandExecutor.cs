using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Delete;

public class DeleteJournalCommandExecutor : ICommandExecutor<DeleteJournalCommand>
{
  private readonly IBaseRepository _repository;

  public DeleteJournalCommandExecutor(IRepository repository)
  {
    _repository = repository;
  }

  public async Task<CommandResult> Execute(DeleteJournalCommand command)
  {
    IJournal? journal = await _repository.GetJournal(command.JournalId);
    if (journal == null)
    {
      return new CommandResult();
    }

    await _repository.DeleteJournal(command.JournalId);

    return new CommandResult(command.JournalId, journal.Permissions.GetUserIdsWithAccess());
  }
}
