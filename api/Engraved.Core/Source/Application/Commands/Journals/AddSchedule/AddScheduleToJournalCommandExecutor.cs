using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Application.Commands.Journals.AddSchedule;

public class AddScheduleToJournalCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<AddScheduleToJournalCommand>
{
  public async Task<CommandResult> Execute(AddScheduleToJournalCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleToJournalCommand.JournalId)} is required");
    }

    IJournal journal = (await repository.GetJournal(command.JournalId))!;

    if (command.NextOccurrence != null)
    {
      journal.Schedules[repository.CurrentUser.Value.Id!] = new Schedule
      {
        NextOccurrence = command.NextOccurrence,
        OnClickUrl = command.OnClickUrl
      };
    }
    else
    {
      journal.Schedules.Remove(repository.CurrentUser.Value.Id!);
    }

    await repository.UpsertJournal(journal);

    var userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.JournalId, userIdsWithAccess);
  }
}
