using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.UpdateTags;

public class UpdateUserTagsCommandExecutor(IUserScopedRepository repository)
  : ICommandExecutor<UpdateUserTagsCommand>
{
  public async Task<CommandResult> Execute(UpdateUserTagsCommand command)
  {
    IUser user = repository.CurrentUser.Value;

    // all tags that are not yet defined
    foreach (var tagName in command.TagNames.Where(tagName => user.Tags.All(tag => tag.Id != tagName.Key)))
    {
      user.Tags.Add(
        new UserTag
        {
          Id = tagName.Key,
          Label = tagName.Value,
        }
      );
    }

    // update existing tag
    foreach (var tagName in command.TagNames.Where(tagName => user.Tags.Any(tag => tag.Id == tagName.Key)))
    {
      UserTag? existingTag = user.Tags.FirstOrDefault(t => t.Id == tagName.Key);
      if (existingTag != null)
      {
        existingTag.Label = tagName.Value;
      }
    }

    // all tags that where defined, but aren't anymore
    foreach (UserTag userTag in user.Tags.Where(tag => !command.TagNames.ContainsKey(tag.Id)).ToList())
    {
      user.Tags.Remove(userTag);
    }

    UpsertResult upsertResult = await repository.UpsertUser(user);
    return new CommandResult(upsertResult.EntityId, []);
  }
}
