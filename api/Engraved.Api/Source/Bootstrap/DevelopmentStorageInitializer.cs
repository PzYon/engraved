using Azure.Storage.Blobs;
using Engraved.Storage.Azure;

namespace Engraved.Api.Bootstrap;

// Registered only when running against development storage. Deliberately never fails startup: e2e
// runs with the same fallback configuration but no Azurite at all, and the API has plenty to do that
// does not involve files.
public class DevelopmentStorageInitializer(
  BlobServiceClient serviceClient,
  IBlobStorageSettings settings,
  ILogger<DevelopmentStorageInitializer> logger
) : IHostedService
{
  private static readonly string[] AllowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

  public async Task StartAsync(CancellationToken cancellationToken)
  {
    try
    {
      await DevelopmentStorageSetup.Ensure(serviceClient, settings.ContainerName, AllowedOrigins);

      logger.LogInformation(
        "Development storage ready: container \"{ContainerName}\", CORS for {Origins}",
        settings.ContainerName,
        string.Join(", ", AllowedOrigins)
      );
    }
    catch (Exception e)
    {
      logger.LogWarning(
        e,
        "Could not prepare development storage - file uploads will fail until Azurite is running "
        + "(npm run storage:start). Everything else works."
      );
    }
  }

  public Task StopAsync(CancellationToken cancellationToken)
  {
    return Task.CompletedTask;
  }
}
