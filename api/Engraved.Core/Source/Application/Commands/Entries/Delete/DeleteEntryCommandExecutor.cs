using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutor : ICommandExecutor
{
  private readonly DeleteEntryCommand _command;

  public DeleteEntryCommandExecutor(DeleteEntryCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    IEntry? entry = await repository.GetEntry(_command.Id);
    if (entry == null)
    {
      return new CommandResult();
    }

    await repository.DeleteEntry(_command.Id);

    IJournal journal = (await repository.GetJournal(entry.ParentId))!;
    journal.EditedOn = dateService.UtcNow;

    await repository.UpsertJournal(journal);

    return new CommandResult(_command.Id, journal.Permissions.GetUserIdsWithAccess());
  }
}
