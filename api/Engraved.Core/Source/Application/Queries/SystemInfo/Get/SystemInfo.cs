namespace Engraved.Core.Application.Queries.SystemInfo.Get;

public class SystemInfo
{
  public string Version { get; set; } = null!;

  public DateTime MergeDateTime { get; set; }

  public string CommitHash { get; set; } = null!;

  public int JournalsCounter { get; set; }

  public int EntriesCount { get; set; }

  public int UsersCount { get; set; }
}
