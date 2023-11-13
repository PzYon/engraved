namespace Engraved.Core.Domain.Permissions;

public enum UserRole
{
  None,
  Owner,
  Reader,
  Writer
}

public interface IPermissionHolder
{
  UserPermissions Permissions { get; set; }

  UserRole UserRole { get; set; }
}
