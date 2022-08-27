namespace Metrix.Core.Domain.Permissions;

public interface IPermissionHolder
{
  Permissions Permissions { get; set; }
}
