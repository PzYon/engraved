using Engraved.Storage.Azure;

namespace Engraved.Api.Settings;

public class BlobStorageSettings : IBlobStorageSettings
{
  public string? ConnectionString { get; set; }

  public string? BlobEndpoint { get; set; }

  public string ContainerName { get; set; } = "files";
}
