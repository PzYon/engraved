using Engraved.Core.Domain.Users;

namespace Engraved.Core.Domain.Permissions;

public class PermissionDefinition
{
  public PermissionKind Kind { get; set; }

  public UserRole? UserRole { set; get; }

  // user is null and only set before returning to client
  public IUser? User { get; set; }
}
