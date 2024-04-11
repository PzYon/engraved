﻿using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Application.Commands.Entries.AddSchedule;

public class AddScheduleToEntryCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<AddScheduleToEntryCommand>
{
  public async Task<CommandResult> Execute(AddScheduleToEntryCommand command)
  {
      if (string.IsNullOrEmpty(command.EntryId))
    {
      throw new InvalidCommandException(command, $"{nameof(AddScheduleToEntryCommand.EntryId)} is required");
    }

    IEntry entry = (await repository.GetEntry(command.EntryId))!;

    entry.Schedules[repository.CurrentUser.Value.Id!] = new Schedule
    {
      NextOccurrence = command.NextOccurrence,
      OnClickUrl = command.OnClickUrl,
      Recurrence = command.Recurrence
    };

    await repository.UpsertEntry(entry);

    IJournal journal = (await repository.GetJournal(entry.ParentId))!;
    string[] userIdsWithAccess = journal.Permissions.GetUserIdsWithAccess().ToArray();

    return new CommandResult(command.EntryId, userIdsWithAccess);
  }
}
