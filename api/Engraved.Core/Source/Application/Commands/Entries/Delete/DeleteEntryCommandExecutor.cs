using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Notifications;

namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutor(
  IUserScopedRepository repository,
  IDateService dateService,
  INotificationService notificationService
)
  : ICommandExecutor<DeleteEntryCommand>
{
  public async Task<CommandResult> Execute(DeleteEntryCommand command)
  {
    IEntry? entry = await repository.GetEntry(command.Id);
    if (entry == null)
    {
      return new CommandResult();
    }

    await notificationService.CancelNotification(
      repository.CurrentUser.Value.GlobalUniqueId.ToString()!,
      command.Id,
      false
    );

    await repository.DeleteEntry(command.Id);

    IJournal journal = (await repository.GetJournal(entry.ParentId))!;
    journal.EditedOn = dateService.UtcNow;

    await repository.UpsertJournal(journal);

    return new CommandResult(command.Id, journal.Permissions.GetUserIdsWithAccess());
  }
}
