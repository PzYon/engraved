namespace Engraved.Core.Domain.Permissions;

// What everybody with access to a journal gets to see of the users it is shared with.
public class PermissionUser
{
  public string? Id { get; set; }

  public string Name { get; set; } = null!;

  public string? DisplayName { get; set; }

  public string? ImageUrl { get; set; }
}
