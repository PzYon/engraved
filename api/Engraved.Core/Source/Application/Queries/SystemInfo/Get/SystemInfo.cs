namespace Engraved.Core.Application.Queries.SystemInfo.Get;

public class SystemInfo
{
  public string Version { get; set; } = null!;

  public DateTime MergeDateTime { get; set; }

  public string CommitHash { get; set; } = null!;

  public long JournalsCount { get; set; }

  public long EntriesCount { get; set; }

  public long UsersCount { get; set; }
}
