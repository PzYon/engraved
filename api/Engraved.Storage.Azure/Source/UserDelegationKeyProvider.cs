using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Engraved.Storage.Azure;

// A user delegation key is what lets the managed identity sign SAS tokens without an account key.
// Fetching one is a network call, so it is kept and reused: without this, every rendered image would
// cost an extra round trip to the storage service before the URL could even be handed out.
//
// Uses the wall clock rather than IDateService on purpose - these lifetimes are validated by the
// storage service against real time, so a shifted clock would only produce keys Azure rejects.
public class UserDelegationKeyProvider(BlobServiceClient serviceClient)
{
  private static readonly TimeSpan KeyLifetime = TimeSpan.FromHours(24);

  // Renew before the key actually expires, so a request never picks up a key that dies between being
  // read here and being used by the browser.
  private static readonly TimeSpan RenewBefore = TimeSpan.FromHours(2);

  private readonly SemaphoreSlim _semaphore = new(1, 1);

  private UserDelegationKey? _key;

  public async Task<UserDelegationKey> Get()
  {
    if (IsUsable(_key))
    {
      return _key!;
    }

    await _semaphore.WaitAsync();

    try
    {
      // Another caller may have refreshed it while we waited.
      if (IsUsable(_key))
      {
        return _key!;
      }

      DateTimeOffset now = DateTimeOffset.UtcNow;

      _key = await serviceClient.GetUserDelegationKeyAsync(now.AddMinutes(-5), now.Add(KeyLifetime));

      return _key;
    }
    finally
    {
      _semaphore.Release();
    }
  }

  private static bool IsUsable(UserDelegationKey? key)
  {
    return key != null && key.SignedExpiresOn - DateTimeOffset.UtcNow > RenewBefore;
  }
}
