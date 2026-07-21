namespace Engraved.Api.Admin;

public class DeleteUserRequest
{
  public string UserId { get; set; } = null!;

  public Guid ConfirmationToken { get; set; }
}
