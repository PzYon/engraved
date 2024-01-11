using System.Reflection;
using Engraved.Core.Application.Persistence;

namespace Engraved.Core.Application.Queries.SystemInfo.Get;

public class GetSystemInfoQueryExecutor(IRepository repository)
  : IQueryExecutor<SystemInfo, GetSystemInfoQuery>
{
  private const string DevInformationalVersion =
    "1.0.0+42+78c0eab8a6ac0ab631cd93a3e41dd8c5ff5e116f+2017-04-20T07:56:16.666Z";

  public bool DisableCache => false;

  public async Task<SystemInfo> Execute(GetSystemInfoQuery query)
  {
    string[] segments = GetInformationalAssemblyVersion().Split("+");

    var systemInfo = new SystemInfo
    {
      JournalsCount = await repository.CountAllJournals(),
      EntriesCount = await repository.CountAllEntries(),
      UsersCount = await repository.CountAllUsers()
    };

    if (segments.Length == 4)
    {
      systemInfo.Version = segments[1];
      systemInfo.CommitHash = segments[2];
      systemInfo.MergeDateTime = DateTime.Parse(segments[3]);
    }
    else
    {
      systemInfo.Version = "0";
      systemInfo.CommitHash = "Unknown";
      systemInfo.MergeDateTime = DateTime.UtcNow;
    }

    return systemInfo;
  }

  private static string GetInformationalAssemblyVersion()
  {
    string? informationalAssemblyVersion = (Assembly
      .GetExecutingAssembly()
      .GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute))
      .FirstOrDefault() as AssemblyInformationalVersionAttribute)?.InformationalVersion;

    return string.IsNullOrEmpty(informationalAssemblyVersion) || informationalAssemblyVersion == "1.0.0"
      ? DevInformationalVersion
      : informationalAssemblyVersion;
  }
}
