using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Metrix.Api.Controllers;

[ApiController]
[Route("api/system_info")]
[AllowAnonymous] //remove
public class SystemInfoController : Controller
{
  public SystemInfo Index()
  {
    var executingAssembly = Assembly.GetExecutingAssembly();
    Version? version = executingAssembly.GetName().Version;

    AssemblyInformationalVersionAttribute? customAttributeData = executingAssembly
      .GetCustomAttributes(typeof(AssemblyInformationalVersionAttribute))
      .FirstOrDefault() as AssemblyInformationalVersionAttribute;

    return new SystemInfo
    {
      Version = version?.ToString(),
      AdditionalStuff = customAttributeData.InformationalVersion,
      BuildDateTime = DateTime.UtcNow
    };
  }
}

public class SystemInfo
{
  public string Version { get; set; }
  public DateTime BuildDateTime { get; set; }
  public string AdditionalStuff { get; set; }
}
