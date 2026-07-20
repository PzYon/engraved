namespace Engraved.Core.Application.Commands.Users.Delete;

public class DeleteUserCommand : ICommand
{
  public string UserId { get; set; } = null!;
}
