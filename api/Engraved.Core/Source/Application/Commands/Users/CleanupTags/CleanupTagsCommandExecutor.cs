using Engraved.Core.Application.Commands.Users.CleanupTags;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.CleanupTags;

public class CleanupTagsCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<CleanupTagsCommand>
{
  public async Task<CommandResult> Execute(CleanupTagsCommand command)
  {
    if (!repository.CurrentUser.IsValueCreated || repository.CurrentUser.Value == null)
    {
      throw new Exception("No current user");
    }

    IUser currentUser = repository.CurrentUser.Value;
    var favoriteJournalIds = currentUser.FavoriteJournalIds;

    var result = new CleanupTagsCommandResult(currentUser.Id!, [currentUser.Id!])
    {
      DryRun = command.DryRun
    };

    if (!favoriteJournalIds.Any())
    {
      return result;
    }

    var allJournals = await repository.GetAllJournals(journalIds: favoriteJournalIds.ToArray());

    var lostJournalIds = favoriteJournalIds
      .Where(i => !allJournals.Select(x => x.Id).Contains(i))
      .ToArray();

    var remainingJournalIds = favoriteJournalIds
      .Where(i => allJournals.Select(x => x.Id).Contains(i))
      .ToArray();

    if (!command.DryRun)
    {
      currentUser.FavoriteJournalIds = remainingJournalIds.ToList();
      await repository.UpsertUser(currentUser);
    }

    result.JournalIdsToRemove = lostJournalIds.ToList();
    return result;
  }
}
