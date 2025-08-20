using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Notifications;
using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Application.Commands.Entries.AddSchedule;

public class AddScheduleToEntryCommandExecutor(
  IUserScopedRepository repository,
  INotificationService notificationService
)
  : ICommandExecutor<AddScheduleToEntryCommand>
{
  public async Task<CommandResult> Execute(AddScheduleToEntryCommand command)
  {
    if (string.IsNullOrEmpty(command.EntryId))
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleToEntryCommand.EntryId)} is required");
    }

    IEntry entry = (await repository.GetEntry(command.EntryId))!;

    if (command.NextOccurrence != null)
    {
      entry.Schedules[repository.CurrentUser.Value.Id!] = new Schedule
      {
        NextOccurrence = command.NextOccurrence,
        OnClickUrl = command.OnClickUrl?.Replace("new-entry-id", entry.Id),
        Recurrence = command.Recurrence
      };
    }
    else
    {
      string? messageId = entry.Schedules[repository.CurrentUser.Value.Id!]?.NotificationId;

      if (!string.IsNullOrEmpty(messageId))
      {
        notificationService.CancelNotification(messageId);
      }

      entry.Schedules.Remove(repository.CurrentUser.Value.Id!);
    }

    await repository.UpsertEntry(entry);

    IJournal journal = (await repository.GetJournal(entry.ParentId))!;
    var userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.EntryId, userIdsWithAccess);
  }
}
