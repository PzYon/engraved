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

    journal.Schedules[repository.CurrentUser.Value.Id!] = new Schedule
    {
      NextOccurrence = command.NextOccurrence,
      OnClickUrl = command.OnClickUrl
    };

    await repository.UpsertJournal(journal);

    string[] userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.JournalId, userIdsWithAccess);
  }
}
