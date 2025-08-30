using Engraved.Core.Application.Commands.Users.CleanupTags;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.CleanupTags;

public class CleanupTagsCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<CleanupTagsCommand>
{
  public async Task<CommandResult> Execute(CleanupTagsCommand command)
  {
    string userId = repository.CurrentUser.Value.Id;

    if (!repository.CurrentUser.Value.FavoriteJournalIds.Any())
    {
      return new CleanupTagsCommandResult(userId, [userId])
      {
        DryRun = command.DryRun,
      };
    }

    var allJournals =
      await repository.GetAllJournals(journalIds: repository.CurrentUser.Value.FavoriteJournalIds.ToArray());

    var lostJournalIds = repository.CurrentUser.Value.FavoriteJournalIds
      .Where(i => !allJournals.Select(x => x.Id).Contains(i))
      .ToArray();

    var remainingJournalIds = repository.CurrentUser.Value.FavoriteJournalIds
      .Where(i => allJournals.Select(x => x.Id).Contains(i))
      .ToArray();

    repository.CurrentUser.Value.FavoriteJournalIds = remainingJournalIds.ToList();

    await repository.UpsertUser(repository.CurrentUser.Value);

    return new CleanupTagsCommandResult(userId, [userId])
    {
      DryRun = command.DryRun,
      JournalIdsToRemove = lostJournalIds.ToList(),
    };
  }
}
