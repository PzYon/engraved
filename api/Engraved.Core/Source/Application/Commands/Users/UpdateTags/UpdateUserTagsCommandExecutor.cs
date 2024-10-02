using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.UpdateTags;

public class UpdateUserTagsCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<UpdateUserTagsCommand>
{
  public async Task<CommandResult> Execute(UpdateUserTagsCommand command)
  {
    IUser user = repository.CurrentUser.Value;

    foreach (var tagName in command.TagNames.Where(t => !user.Tags.ContainsKey(t)))
    {
      user.Tags.Add(tagName, []);
    }

    foreach (var tagKey in user.Tags.Keys.Where(t => !command.TagNames.Contains(t)))
    {
      user.Tags.Remove(tagKey);
    }

    UpsertResult upsertResult = await repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, []);
  }
}
