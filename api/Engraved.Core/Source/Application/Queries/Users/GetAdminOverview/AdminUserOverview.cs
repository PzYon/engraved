namespace Engraved.Core.Application.Queries.Users.GetAdminOverview;

public class AdminUserOverview
{
  public string Id { get; set; } = null!;

  public string Name { get; set; } = null!;

  public string? DisplayName { get; set; }

  public long JournalsCount { get; set; }

  public long EntriesCount { get; set; }

  public DateTime? LastLoginDate { get; set; }
}
