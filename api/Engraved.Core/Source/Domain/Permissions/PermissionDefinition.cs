namespace Engraved.Core.Domain.Permissions;

public class PermissionDefinition
{
  public PermissionKind Kind { get; set; }

  public UserRole? UserRole { get; set; }

  // user is null and only set before returning to client
  public PermissionUser? User { get; set; }
}
