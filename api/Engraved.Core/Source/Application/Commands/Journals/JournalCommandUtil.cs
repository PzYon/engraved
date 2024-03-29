﻿using Engraved.Core.Application.Commands.Entries.Upsert;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals;

public static class JournalCommandUtil
{
  public static async Task<TJournal> LoadAndValidateJournal<TJournal>(
    IBaseRepository repository,
    ICommand command,
    string journalId
  )
    where TJournal : class, IJournal
  {
    if (string.IsNullOrEmpty(journalId))
    {
      throw new InvalidCommandException(
        command,
        $"A {nameof(BaseUpsertEntryCommand.JournalId)} must be specified."
      );
    }

    IJournal? journal = await repository.GetJournal(journalId);

    if (journal is not TJournal specificJournal)
    {
      throw new InvalidCommandException(command, $"A journal with key \"{journalId}\" does not exist.");
    }

    return specificJournal;
  }
}
