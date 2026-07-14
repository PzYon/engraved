using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Journals.UpdateTags;

public class UpdateJournalUserTagsCommandExecutor(IUserRepository userRepository, Lazy<IUser> currentUser)
  : ICommandExecutor<UpdateJournalUserTagsCommand>
{
  public async Task<CommandResult> Execute(UpdateJournalUserTagsCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.JournalId)}\" must be specified");
    }

    IUser user = currentUser.Value;

    foreach (UserTag tag in user.Tags)
    {
      if (command.TagIds.Contains(tag.Id))
      {
        if (!tag.JournalIds.Contains(command.JournalId))
        {
          tag.JournalIds.Add(command.JournalId);
        }
      }
      else
      {
        tag.JournalIds.Remove(command.JournalId);
      }
    }

    await userRepository.UpsertUser(user);

    return new CommandResult(user.Id!, []);
  }
}
