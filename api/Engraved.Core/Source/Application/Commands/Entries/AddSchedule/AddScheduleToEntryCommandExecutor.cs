using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Entries.AddSchedule;

public class AddScheduleToEntryCommandExecutor(
  IEntryRepository entryRepository,
  IJournalRepository journalRepository,
  Lazy<IUser> currentUser
)
  : ICommandExecutor<AddScheduleToEntryCommand>
{
  public async Task<CommandResult> Execute(AddScheduleToEntryCommand command)
  {
    if (string.IsNullOrEmpty(command.EntryId))
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleToEntryCommand.EntryId)} is required");
    }

    IEntry entry = (await entryRepository.GetEntry(command.EntryId))!;

    if (command.NextOccurrence != null)
    {
      entry.Schedules[currentUser.Value.Id!] = new Schedule
      {
        NextOccurrence = command.NextOccurrence,
        OnClickUrl = command.OnClickUrl?.Replace("new-entry-id", entry.Id),
        Recurrence = command.Recurrence
      };
    }
    else
    {
      entry.Schedules.Remove(currentUser.Value.Id!);
    }

    await entryRepository.UpsertEntry(entry);

    IJournal journal = (await journalRepository.GetJournal(entry.ParentId))!;
    var userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.EntryId, userIdsWithAccess);
  }
}
