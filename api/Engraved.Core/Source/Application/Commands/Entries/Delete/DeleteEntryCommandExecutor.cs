using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutor(IRepository repository, IDateService dateService)
  : ICommandExecutor<DeleteEntryCommand>
{
  public async Task<CommandResult> Execute(DeleteEntryCommand command)
  {
    IEntry? entry = await repository.GetEntry(command.Id);
    if (entry == null)
    {
      return new CommandResult();
    }

    await repository.DeleteEntry(command.Id);

    IJournal journal = (await repository.GetJournal(entry.ParentId))!;
    journal.EditedOn = dateService.UtcNow;

    await repository.UpsertJournal(journal);

    return new CommandResult(command.Id, journal.Permissions.GetUserIdsWithAccess());
  }
}
