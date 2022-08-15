using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

public class SystemInfo
{
  public string Version { get; set; } = null!;

  public DateTime MergeDateTime { get; set; }

  public string CommitHash { get; set; } = null!;
}

[ApiController]
[Route("api/system_info")]
public class SystemInfoController : Controller
{
  public SystemInfo Get()
  {
    var value = GetInformationalAssemblyVersion()
                ?? "1.0.0+42+78c0eab8a6ac0ab631cd93a3e41dd8c5ff5e116f+2017-04-20T07:56:16Z";

    string[] segments = value.Split("+");

    if (segments.Length == 4)
    {
      return new SystemInfo
      {
        Version = segments[1],
        CommitHash = segments[2],
        MergeDateTime = DateTime.Parse(segments[3])
      };
    }

    return new SystemInfo
    {
      Version = "0",
      CommitHash = "Unknown",
      MergeDateTime = DateTime.UtcNow
    };
  }

  private static string? GetInformationalAssemblyVersion()
  {
    return (Assembly
      .GetExecutingAssembly()
      .GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute))
      .FirstOrDefault() as AssemblyInformationalVersionAttribute)?.InformationalVersion;
  }
}
