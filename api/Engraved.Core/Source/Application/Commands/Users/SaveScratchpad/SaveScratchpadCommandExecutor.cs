using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;

namespace Engraved.Core.Application.Commands.Users.SaveScratchpad;

public class SaveScratchpadCommandExecutor(
  IUserRepository userRepository,
  Lazy<IUser> currentUser,
  IDateService dateService
) : ICommandExecutor<SaveScratchpadCommand>
{
  // The scratchpad is part of the user, which is loaded with every request, so it must not be
  // allowed to grow without bounds.
  public const int MaxContentLength = 100_000;

  public async Task<CommandResult> Execute(SaveScratchpadCommand command)
  {
    if (command.Content.Length > MaxContentLength)
    {
      throw new InvalidCommandException(command, $"Content must not be longer than {MaxContentLength} characters.");
    }

    var userId = currentUser.Value.Id!;

    var scratchpad = new UserScratchpad
    {
      Content = command.Content,
      // MongoDB keeps milliseconds only. Returning the same value it stores lets the client tell
      // its own save apart from a later one when it loads the scratchpad again.
      EditedOn = TruncateToMilliseconds(dateService.UtcNow)
    };

    await userRepository.UpdateScratchpad(userId, scratchpad);

    return new SaveScratchpadCommandResult(userId, scratchpad.EditedOn);
  }

  private static DateTime TruncateToMilliseconds(DateTime dateTime)
  {
    return dateTime.AddTicks(-(dateTime.Ticks % TimeSpan.TicksPerMillisecond));
  }
}
