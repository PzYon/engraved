using Metrix.Core.Domain.User;

namespace Metrix.Core.Domain.Permissions;

public class PermissionDefinition
{
  public PermissionKind Kind { get; set; }

  public IUser? User { get; set; }
}
