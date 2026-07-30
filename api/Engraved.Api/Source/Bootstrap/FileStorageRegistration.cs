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
    bool useDevelopmentDefaults
  )
  {
    BlobStorageSettings settings = CreateSettings(configuration, useDevelopmentDefaults);

    services.AddSingleton<IBlobStorageSettings>(settings);

    // File ids carry a signature tying them to the user the upload was issued to, so that attaching
    // one to an entry can be checked without storing anything. Reuses the JWT secret on purpose: it
    // is already configured on both app services, and a second secret would be a second thing to
    // keep in sync for no gain.
    services.AddSingleton<IFileIdFactory>(
      _ => new FileIdFactory(GetSigningKey(configuration, useDevelopmentDefaults))
    );

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

  private static string GetSigningKey(IConfiguration configuration, bool useDevelopmentDefaults)
  {
    var jwtSecret = configuration.GetSection("Authentication")
      .GetValue<string>(nameof(AuthenticationConfig.JwtSecret));

    if (!string.IsNullOrEmpty(jwtSecret))
    {
      return jwtSecret;
    }

    // e2e tests authenticate with the basic-auth handler and never set up JWT at all, so there is no
    // secret to borrow. Falling back keeps entry saving - which now resolves this on every upsert -
    // working there; outside development a missing secret is a real misconfiguration.
    if (!useDevelopmentDefaults)
    {
      throw new InvalidOperationException("App Service Config: No JWT Secret available to sign file ids.");
    }

    return "development-file-id-signing-key";
  }

  private static BlobStorageSettings CreateSettings(IConfiguration configuration, bool useDevelopmentDefaults)
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
    if (!useDevelopmentDefaults)
    {
      throw new InvalidOperationException("App Service Config: No file storage configuration available.");
    }

    settings.ConnectionString = "UseDevelopmentStorage=true";

    return settings;
  }
}
