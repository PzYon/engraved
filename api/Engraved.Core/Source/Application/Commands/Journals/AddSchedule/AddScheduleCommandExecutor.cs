using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.AddSchedule;

public class AddScheduleCommandExecutor(IRepository repository) : ICommandExecutor<AddScheduleCommand>
{
  private readonly IBaseRepository _repository = repository;

  public async Task<CommandResult> Execute(AddScheduleCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleCommand.JournalId)} is required");
    }

    if (command.NextOccurrence == null)
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleCommand.NextOccurrence)} cannot be null");
    }

    IJournal journal = (await _repository.GetJournal(command.JournalId))!;

    journal.Schedule = new Schedule
    {
      NextOccurrence = command.NextOccurrence
    };

    await _repository.UpsertJournal(journal);

    string[] userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.JournalId, userIdsWithAccess);
  }
}
