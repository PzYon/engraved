namespace Engraved.Core.Application.Commands.Users.Delete;

public class DeleteUserCommand : ICommand
{
  public string UserId { get; set; } = null!;

  // Mirrors the UI's type-the-user's-name-to-confirm flow (DeleteButtons.tsx) on the server side,
  // so a caller hitting this endpoint directly (e.g. by mistake, or a script) still has to know and
  // supply the exact user being deleted, not just its id.
  public string ConfirmedUserName { get; set; } = null!;
}
