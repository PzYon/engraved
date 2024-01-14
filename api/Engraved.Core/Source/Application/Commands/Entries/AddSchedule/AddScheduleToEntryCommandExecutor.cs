using Engraved.Core.Application.Commands.Journals.AddSchedule;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.AddSchedule;

public class AddScheduleToEntryCommandExecutor(IRepository repository) : ICommandExecutor<AddScheduleToEntryCommand>
{
  private readonly IBaseRepository _repository = repository;

  public async Task<CommandResult> Execute(AddScheduleToEntryCommand command)
  {
    if (string.IsNullOrEmpty(command.EntryId))
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleToEntryCommand.EntryId)} is required");
    }

    if (command.NextOccurrence == null)
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleToEntryCommand.NextOccurrence)} cannot be null");
    }

    IEntry entry = (await _repository.GetEntry(command.EntryId))!;

    entry.Schedule = new Schedule
    {
      NextOccurrence = command.NextOccurrence
    };

    await _repository.UpsertEntry(entry);

    IJournal journal = (await _repository.GetJournal(entry.ParentId))!;
    string[] userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.EntryId, userIdsWithAccess);
  }
}
