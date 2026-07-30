using Azure.Storage.Blobs;
using Engraved.Api.Settings;
using Engraved.Core.Application.Files;
using Engraved.Storage.Azure;

namespace Engraved.Api.Bootstrap;

public static class FileStorageRegistration
{
  public static void RegisterFileStorage(
    IServiceCollection services,
    IConfiguration configuration,
    bool useDevelopmentStorage
  )
  {
    BlobStorageSettings settings = CreateSettings(configuration, useDevelopmentStorage);

    services.AddSingleton<IBlobStorageSettings>(settings);

    // The blob clients hold the connection pool and, with managed identity, a cached token, so they
    // are meant to live as long as the application rather than be rebuilt per request. The same
    // applies to the file store, whose delegation key provider exists precisely to keep one key
    // around instead of fetching one per URL.
    services.AddSingleton(_ => BlobContainerClientFactory.CreateServiceClient(settings));

    services.AddSingleton<IFileStore>(provider =>
      {
        var serviceClient = provider.GetRequiredService<BlobServiceClient>();
        BlobContainerClient containerClient = serviceClient.GetBlobContainerClient(settings.ContainerName);

        return new AzureBlobFileStore(
          containerClient,
          BlobContainerClientFactory.CreateUserDelegationKeyProvider(serviceClient, containerClient)
        );
      }
    );
  }

  private static BlobStorageSettings CreateSettings(IConfiguration configuration, bool useDevelopmentStorage)
  {
    var settings = new BlobStorageSettings();

    configuration.GetSection("FileStorage").Bind(settings);

    if (!string.IsNullOrEmpty(settings.ConnectionString) || !string.IsNullOrEmpty(settings.BlobEndpoint))
    {
      return settings;
    }

    // Local development and e2e tests fall back to Azurite, whose well-known development credentials
    // this connection string stands for. In Azure the blob endpoint comes from app service
    // configuration and authentication from the managed identity, so a missing value there is a
    // misconfiguration and has to fail loudly rather than quietly point at a local emulator.
    if (!useDevelopmentStorage)
    {
      throw new InvalidOperationException("App Service Config: No file storage configuration available.");
    }

    settings.ConnectionString = "UseDevelopmentStorage=true";

    return settings;
  }
}
