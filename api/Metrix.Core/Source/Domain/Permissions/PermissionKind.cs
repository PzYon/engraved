namespace Metrix.Core.Domain.Permissions;

[Flags]
public enum PermissionKind
{
  None = 0,
  Read = 1,
  Write = 2
}
