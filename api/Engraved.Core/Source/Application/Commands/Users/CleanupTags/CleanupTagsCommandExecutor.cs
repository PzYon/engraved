using Engraved.Core.Application.Commands.Users.CleanupTags;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.CleanupTags;

public class CleanupTagsCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<CleanupTagsCommand>
{
  public async Task<CommandResult> Execute(CleanupTagsCommand command)
  {
    if (repository.CurrentUser.Value == null)
    {
      throw new Exception("No current user");
    }

    IUser currentUser = repository.CurrentUser.Value;
    var journalIdsFromTags = currentUser.Tags.SelectMany(t => t.JournalIds).ToList();

    var result = new CleanupTagsCommandResult(currentUser.Id!, [currentUser.Id!])
    {
      DryRun = command.DryRun
    };

    if (!journalIdsFromTags.Any())
    {
      return result;
    }

    var allJournals = await repository.GetAllJournals(journalIds: journalIdsFromTags.ToArray());
    var allJournalIds = allJournals.Select(x => x.Id);

    var lostJournalIds = journalIdsFromTags
      .Where(i => !allJournalIds.Contains(i))
      .ToArray();

    if (!command.DryRun)
    {
      foreach (UserTag tag in currentUser.Tags)
      {
        tag.JournalIds.RemoveAll(i => lostJournalIds.Contains(i));
      }

      await repository.UpsertUser(currentUser);
    }

    result.JournalIdsToRemove = lostJournalIds.ToList();
    return result;
  }
}
