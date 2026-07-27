namespace Engraved.Storage.Azure;

public interface IBlobStorageSettings
{
  // Set for local development only, where Azurite is addressed with its well-known account key
  // ("UseDevelopmentStorage=true"). In Azure this stays empty and the managed identity is used
  // instead, so there is no secret to configure or rotate.
  string? ConnectionString { get; }

  // e.g. https://engravedfiles.blob.core.windows.net - used when no connection string is set.
  string? BlobEndpoint { get; }

  string ContainerName { get; }
}
