namespace Engraved.Core.Domain.Permissions;

public interface IPermissionHolder
{
  UserPermissions Permissions { get; set; }
}
