﻿using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

public class SystemInfo
{
  public string Version { get; set; }

  public DateTime BuildDateTime { get; set; }

  public string CommitHash { get; set; }
  
  public string ALL { get; set; }
}

[ApiController]
[Route("api/system_info")]
[AllowAnonymous] //remove
public class SystemInfoController : Controller
{
  public SystemInfo Index()
  {
    var executingAssembly = Assembly.GetExecutingAssembly();

    AssemblyInformationalVersionAttribute? customAttributeData = executingAssembly
      .GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute))
      .FirstOrDefault() as AssemblyInformationalVersionAttribute;

    if (customAttributeData == null)
    {
      // local/dev mode
      return new SystemInfo()
      {
        Version = "42",
        CommitHash = "78c0eab8a6ac0ab631cd93a3e41dd8c5ff5e116f",
        BuildDateTime = DateTime.UtcNow.AddYears(37),
      };
    }

    string[] segments = customAttributeData.InformationalVersion.Split("+");

    return new SystemInfo
    {
      ALL = customAttributeData.InformationalVersion,
      Version = segments[0],
      CommitHash = segments[1],
      BuildDateTime = DateTime.UtcNow
    };
  }
}
