using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Engraved.Storage.Azure;

// Azurite starts empty and with no CORS rules, so a fresh clone would get a 404 on the first upload
// and an opaque CORS failure on the one after that. In Azure both are deliberate setup steps done
// once by hand; locally there is no reason to make anyone do them, and no az CLI is needed either.
public static class DevelopmentStorageSetup
{
  public static async Task Ensure(
    BlobServiceClient serviceClient,
    string containerName,
    string[] allowedOrigins
  )
  {
    await serviceClient.GetBlobContainerClient(containerName).CreateIfNotExistsAsync();

    BlobServiceProperties properties = await serviceClient.GetPropertiesAsync();

    properties.Cors.Clear();
    properties.Cors.Add(
      new BlobCorsRule
      {
        AllowedOrigins = string.Join(",", allowedOrigins),
        AllowedMethods = "GET,HEAD,PUT,OPTIONS",
        AllowedHeaders = "*",
        ExposedHeaders = "*",
        MaxAgeInSeconds = 3600
      }
    );

    await serviceClient.SetPropertiesAsync(properties);
  }
}
