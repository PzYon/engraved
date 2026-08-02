using Azure.Storage.Blobs;
using Engraved.Api.Settings;
using Engraved.Core.Application.Files;
using Engraved.Storage.Azure;

namespace Engraved.Api.Bootstrap;

public static class FileStorageRegistration
{
  private const string SectionName = "FileStorage";

  private const string DevelopmentConnectionString = "UseDevelopmentStorage=true";

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

    // Built here rather than inside a factory lambda so that unusable configuration fails the
    // startup. Resolved lazily, the first construction happens on an entry upsert - every upsert
    // signs file ids - so a bad value would show up as failing saves in an application that came up
    // fine, rather than as a deployment that does not come up. Neither constructor does any I/O, so
    // this costs nothing and still says nothing about whether the account can be reached.
    BlobServiceClient serviceClient = BlobContainerClientFactory.CreateServiceClient(settings);
    BlobContainerClient containerClient = serviceClient.GetBlobContainerClient(settings.ContainerName);

    // The blob clients hold the connection pool and, with managed identity, a cached token, so they
    // are meant to live as long as the application rather than be rebuilt per request. The same
    // applies to the file store, whose delegation key provider exists precisely to keep one key
    // around instead of fetching one per URL.
    services.AddSingleton(serviceClient);

    services.AddSingleton<IFileStore>(
      new AzureBlobFileStore(
        containerClient,
        BlobContainerClientFactory.CreateUserDelegationKeyProvider(serviceClient, containerClient)
      )
    );

    // The container and its CORS rules are one-off setup steps, done by hand in Azure. Against
    // Azurite there is no reason to make anyone do them by hand, so they happen on startup.
    if (settings.ConnectionString == DevelopmentConnectionString)
    {
      services.AddHostedService<DevelopmentStorageInitializer>();
    }
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

    configuration.GetSection(SectionName).Bind(settings);

    Validate(settings);

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

    settings.ConnectionString = DevelopmentConnectionString;

    return settings;
  }

  // The two credential settings are alternatives, and the connection string silently wins over the
  // endpoint. That precedence is invisible from the outside, so the combinations it makes meaningless
  // are rejected here by name instead of turning into an unrelated parse error deeper down.
  private static void Validate(IBlobStorageSettings settings)
  {
    var connectionString = settings.ConnectionString;
    var blobEndpoint = settings.BlobEndpoint;

    if (!string.IsNullOrEmpty(connectionString) && !string.IsNullOrEmpty(blobEndpoint))
    {
      throw new InvalidOperationException(
        $"App Service Config: only one of {Setting(nameof(settings.ConnectionString))} and "
        + $"{Setting(nameof(settings.BlobEndpoint))} can be set. The connection string takes precedence "
        + "and the endpoint is then never read, which is never what is meant."
      );
    }

    if (!string.IsNullOrEmpty(connectionString) && !connectionString.Contains('='))
    {
      throw new InvalidOperationException(
        $"App Service Config: {Setting(nameof(settings.ConnectionString))} is not a connection string, "
        + "which is a list of \"name=value\" pairs. To authenticate with the managed identity, leave it "
        + $"unset and put the account URL into {Setting(nameof(settings.BlobEndpoint))} instead."
      );
    }

    if (!string.IsNullOrEmpty(blobEndpoint) && !Uri.TryCreate(blobEndpoint, UriKind.Absolute, out _))
    {
      throw new InvalidOperationException(
        $"App Service Config: {Setting(nameof(settings.BlobEndpoint))} is not an absolute URL, e.g. "
        + "\"https://<account>.blob.core.windows.net\"."
      );
    }

    if (string.IsNullOrWhiteSpace(settings.ContainerName))
    {
      throw new InvalidOperationException($"App Service Config: {Setting(nameof(settings.ContainerName))} is empty.");
    }
  }

  // Named the way it has to be typed into app service configuration, which is not how the section
  // and key read in appsettings.json.
  private static string Setting(string name)
  {
    return $"{SectionName}__{name}";
  }
}
