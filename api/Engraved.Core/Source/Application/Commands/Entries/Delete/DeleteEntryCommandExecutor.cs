using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutor : ICommandExecutor<DeleteEntryCommand>
{
  private readonly IBaseRepository _repository;
  private readonly IDateService _dateService;

  public DeleteEntryCommandExecutor(IRepository repository, IDateService dateService)
  {
    _repository = repository;
    _dateService = dateService;
  }

  public async Task<CommandResult> Execute(DeleteEntryCommand command)
  {
    IEntry? entry = await _repository.GetEntry(command.Id);
    if (entry == null)
    {
      return new CommandResult();
    }

    await _repository.DeleteEntry(command.Id);

    IJournal journal = (await _repository.GetJournal(entry.ParentId))!;
    journal.EditedOn = _dateService.UtcNow;

    await _repository.UpsertJournal(journal);

    return new CommandResult(command.Id, journal.Permissions.GetUserIdsWithAccess());
  }
}
