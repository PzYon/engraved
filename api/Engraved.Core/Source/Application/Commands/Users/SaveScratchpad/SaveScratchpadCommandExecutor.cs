using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.SaveScratchpad;

public class SaveScratchpadCommandExecutor(
  IUserRepository userRepository,
  Lazy<IUser> currentUser
) : ICommandExecutor<SaveScratchpadCommand>
{
  public async Task<CommandResult> Execute(SaveScratchpadCommand command)
  {
    var userId = currentUser.Value.Id!;

    await userRepository.UpdateScratchpad(
      userId,
      new UserScratchpad { Content = command.Content }
    );

    return new CommandResult(userId, []);
  }
}
