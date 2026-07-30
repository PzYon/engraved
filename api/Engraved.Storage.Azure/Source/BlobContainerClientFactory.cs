using Azure.Identity;
using Azure.Storage.Blobs;

namespace Engraved.Storage.Azure;

public static class BlobContainerClientFactory
{
  public static BlobServiceClient CreateServiceClient(IBlobStorageSettings settings)
  {
    if (!string.IsNullOrEmpty(settings.ConnectionString))
    {
      return new BlobServiceClient(settings.ConnectionString);
    }

    if (string.IsNullOrEmpty(settings.BlobEndpoint))
    {
      throw new InvalidOperationException(
        $"File storage: either {nameof(IBlobStorageSettings.ConnectionString)} or "
        + $"{nameof(IBlobStorageSettings.BlobEndpoint)} must be configured."
      );
    }

    // No secret to configure or rotate: in Azure this resolves to the app service's managed
    // identity, locally to the developer's Azure login.
    return new BlobServiceClient(new Uri(settings.BlobEndpoint), new DefaultAzureCredential());
  }

  // Signing SAS tokens with the account key is only possible when the client was built from a
  // connection string that carries one - i.e. local Azurite. Everywhere else a user delegation key
  // is needed, and that provider must be shared so the key is fetched once rather than per URL.
  public static UserDelegationKeyProvider? CreateUserDelegationKeyProvider(
    BlobServiceClient serviceClient,
    BlobContainerClient containerClient
  )
  {
    return containerClient.CanGenerateSasUri ? null : new UserDelegationKeyProvider(serviceClient);
  }
}
