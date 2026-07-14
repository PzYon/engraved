using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;
using Microsoft.Extensions.Caching.Memory;

namespace Engraved.Api.Authentication;

// Caches the name -> user lookup that runs on (almost) every authenticated request.
//
// This used to keep an unbounded dictionary for the whole process lifetime: every user that ever
// authenticated stayed in memory forever and was never re-read from the database. A dedicated
// MemoryCache bounds both problems - a hard entry cap caps memory, and a sliding expiration evicts
// users that stop making requests while periodically forcing a refresh for those that keep going.
public sealed class UserLoader(IUnrestrictedRepository unrestrictedRepository) : IDisposable
{
  private const int MaxCachedUsers = 10_000;
  private static readonly TimeSpan SlidingExpiration = TimeSpan.FromMinutes(10);

  private readonly MemoryCache _cache = new(new MemoryCacheOptions { SizeLimit = MaxCachedUsers });

  public void Dispose()
  {
    _cache.Dispose();
  }

  public async Task<IUser> GetUser(string name)
  {
    if (_cache.TryGetValue(name, out IUser? cachedUser))
    {
      return cachedUser!;
    }

    // deliberately do not cache misses: a user that doesn't exist yet may be created moments later
    IUser user = await unrestrictedRepository.GetUser(name)
                 ?? throw new NotAllowedOperationException($"Current user '{name}' does not exist.");

    Cache(user);

    return user;
  }

  public void SetUser(IUser user)
  {
    Cache(user);
  }

  private void Cache(IUser user)
  {
    _cache.Set(
      user.Name,
      user,
      new MemoryCacheEntryOptions
      {
        Size = 1,
        SlidingExpiration = SlidingExpiration
      }
    );
  }
}
