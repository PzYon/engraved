using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Journals.AddSchedule;

public class AddScheduleToJournalCommandExecutor(IJournalRepository journalRepository, Lazy<IUser> currentUser)
  : ICommandExecutor<AddScheduleToJournalCommand>
{
  public async Task<CommandResult> Execute(AddScheduleToJournalCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleToJournalCommand.JournalId)} is required");
    }

    IJournal journal = (await journalRepository.GetJournal(command.JournalId))!;

    if (command.NextOccurrence != null)
    {
      journal.Schedules[currentUser.Value.Id!] = new Schedule
      {
        NextOccurrence = command.NextOccurrence,
        OnClickUrl = command.OnClickUrl,
        Recurrence = command.Recurrence
      };
    }
    else
    {
      journal.Schedules.Remove(currentUser.Value.Id!);
    }

    await journalRepository.UpsertJournal(journal);

    var userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.JournalId, userIdsWithAccess);
  }
}
