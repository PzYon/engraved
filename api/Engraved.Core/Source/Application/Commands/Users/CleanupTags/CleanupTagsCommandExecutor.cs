using Engraved.Core.Application.Commands.Users.CleanupTags;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.CleanupTags;

public class CleanupTagsCommandExecutor(
  IUserRepository userRepository,
  IJournalRepository journalRepository,
  Lazy<IUser> currentUser
)
  : ICommandExecutor<CleanupTagsCommand>
{
  public async Task<CommandResult> Execute(CleanupTagsCommand command)
  {
    if (currentUser.Value == null)
    {
      throw new NotAllowedOperationException("Current user is not available.");
    }

    IUser user = currentUser.Value;
    var journalIdsFromTags = user.Tags.SelectMany(t => t.JournalIds).ToList();

    var result = new CleanupTagsCommandResult(user.Id!, [user.Id!])
    {
      DryRun = command.DryRun
    };

    if (!journalIdsFromTags.Any())
    {
      return result;
    }

    var allJournals = await journalRepository.GetAllJournals(journalIds: journalIdsFromTags.ToArray());
    var allJournalIds = allJournals.Select(x => x.Id);

    var lostJournalIds = journalIdsFromTags
      .Where(i => !allJournalIds.Contains(i))
      .ToArray();

    if (!command.DryRun)
    {
      foreach (UserTag tag in user.Tags)
      {
        tag.JournalIds.RemoveAll(i => lostJournalIds.Contains(i));
      }

      await userRepository.UpsertUser(user);
    }

    result.JournalIdsToRemove = lostJournalIds.ToList();
    return result;
  }
}
