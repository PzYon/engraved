namespace Engraved.Core.Application.Files;

public static class FileSizeLimits
{
  // Deliberately a constant rather than configuration: there is one deployment, and the value only
  // ever changes as a considered decision about storage cost.
  public const long MaxFileSizeBytes = 10 * 1024 * 1024;
}
