namespace Metrix.Core.Domain.Permissions;

public interface IHasPermissions
{
  Permissions Permissions { get; set; }
}
