using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Journals.UpdateTags;

public class UpdateJournalUserTagsCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<UpdateJournalUserTagsCommand>
{
  public async Task<CommandResult> Execute(UpdateJournalUserTagsCommand command)
  {
    if (string.IsNullOrEmpty(command.JournalId))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.JournalId)}\" must be specified");
    }

    IUser user = repository.CurrentUser.Value;

    foreach (var kvp in user.Tags)
    {
      if (command.TagNames.Contains(kvp.Key))
      {
        if (!kvp.Value.Contains(command.JournalId))
        {
          kvp.Value.Add(command.JournalId);
        }
      }
      else
      {
        kvp.Value.Remove(command.JournalId);
      }
    }

    await repository.UpsertUser(user);
    
    return new CommandResult(user.Id!, []);
  }
}
