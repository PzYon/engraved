using Engraved.Core.Domain.User;

namespace Engraved.Core.Domain.Permissions;

public class PermissionDefinition
{
  public PermissionKind Kind { get; set; }

  public IUser? User { get; set; }
}
