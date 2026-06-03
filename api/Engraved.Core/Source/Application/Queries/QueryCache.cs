using Engraved.Core.Domain.Users;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Concurrent;

namespace Engraved.Core.Application.Queries;

public class QueryCache(ILogger<QueryCache> logger, IMemoryCache memoryCache, Lazy<IUser> currentUser)
{
  private const string KeysByUserId = "___keysByUserId";
  private const string GenerationIdsByUserId = "___generationsByUserId";

  private ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> QueryKeysByUser
    => memoryCache.GetOrCreate(
      KeysByUserId,
      _ => new ConcurrentDictionary<string, ConcurrentDictionary<string, byte>>()
    )!;

  // Monotonically increasing "generation" per user, bumped on every
  // invalidation. A cached item is only valid while its generation still
  // matches the user's current generation (see TryGetValue).
  private ConcurrentDictionary<string, long> GenerationIdsByUser
    => memoryCache.GetOrCreate(
      GenerationIdsByUserId,
      _ => new ConcurrentDictionary<string, long>()
    )!;

  // Returns the cached value for the query, or executes it and caches the
  // result. The generation is captured *before* executing, inside this method,
  // so callers cannot accidentally reorder the capture relative to the read or
  // forget to pass it to Set: if a command invalidates this user's cache while
  // the query runs, the captured generation becomes stale and the freshly
  // computed result is simply ignored on the next read.
  public async Task<TValue> GetOrCreate<TValue, TQuery>(
    IQueryExecutor<TValue, TQuery> queryExecutor,
    TQuery query,
    Func<Task<TValue>> execute
  )
    where TQuery : IQuery
  {
    if (queryExecutor.DisableCache)
    {
      return await execute();
    }

    if (TryGetValue(queryExecutor, query, out TValue? cachedValue))
    {
      return cachedValue!;
    }

    long generationId = GetGenerationId();

    TValue value = await execute();

    Set(queryExecutor, query, value, generationId);

    return value;
  }

  public void Set<TValue, TQuery>(
    IQueryExecutor<TValue, TQuery> queryExecutor,
    TQuery query,
    TValue value,
    long generationId
  )
    where TQuery : IQuery
  {
    var key = GetKey(queryExecutor);

    RememberQueryKeyForUser(key);

    memoryCache.Set(
      key,
      new CacheItem<TValue>
      {
        Value = value,
        ConfigToken = GetConfigToken(query),
        GenerationId = generationId
      },
      new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(10))
    );
  }

  public bool TryGetValue<TValue, TQuery>(IQueryExecutor<TValue, TQuery> queryExecutor, TQuery query, out TValue? value)
    where TQuery : IQuery
  {
    var key = GetKey(queryExecutor);

    if (!memoryCache.TryGetValue(key, out CacheItem<TValue>? cacheItem))
    {
      logger.LogInformation("{Key}: Cache miss (not available)", key);
      value = default;
      return false;
    }

    if (cacheItem!.GenerationId != GetGenerationId())
    {
      // The cache was invalidated after this item's underlying data was read,
      // so the item may be stale and must not be served.
      logger.LogInformation("{Key}: Cache miss (stale generation)", key);
      value = default!;
      return false;
    }

    var configToken = GetConfigToken(query);
    if (cacheItem.ConfigToken != configToken)
    {
      logger.LogInformation("{Key}: Cache miss (different token): {ConfigToken}", key, configToken);
      value = default!;
      return false;
    }

    logger.LogInformation("{Key}: Cache hit", key);
    value = cacheItem.Value;
    return true;
  }

  public void Invalidate(string[] affectedUserIds)
  {
    foreach (var user in affectedUserIds)
    {
      ClearForUser(user);
    }
  }

  public void ClearCurrentUser()
  {
    ClearForUser(GetUserId());
  }

  public long GetGenerationId()
  {
    return GenerationIdsByUser.TryGetValue(GetUserId(), out var generation) ? generation : 0;
  }

  private void ClearForUser(string userId)
  {
    // Bump the generation first: this is what makes invalidation safe against a
    // concurrent query that has already read its data but not yet written it to
    // the cache (such a write would carry the now-outdated generation).
    var generation = GenerationIdsByUser.AddOrUpdate(userId, 1, (_, current) => current + 1);

    if (!QueryKeysByUser.TryGetValue(userId, out var keys) || keys.IsEmpty)
    {
      return;
    }

    logger.LogInformation(
      "Invalidating cache for user {UserId} (generation {Generation}), {ValueCount} items affected",
      userId,
      generation,
      keys.Count
    );

    foreach (var key in keys.Keys)
    {
      memoryCache.Remove(key);
    }
  }

  private string GetKey<TValue, TQuery>(IQueryExecutor<TValue, TQuery> queryExecutor)
    where TQuery : IQuery
  {
    return queryExecutor.GetType().Name + "_" + currentUser.Value.Id;
  }

  private static string GetConfigToken(IQuery query)
  {
    return JsonConvert.SerializeObject(query);
  }

  private void RememberQueryKeyForUser(string queryKey)
  {
    QueryKeysByUser
      .GetOrAdd(GetUserId(), _ => new ConcurrentDictionary<string, byte>())
      .TryAdd(queryKey, 0);
  }

  private string GetUserId()
  {
    var userId = currentUser.Value.Id;
    if (string.IsNullOrEmpty(userId))
    {
      throw new Exception("User ID is not available.");
    }

    return userId;
  }

  private class CacheItem<TResult>
  {
    public TResult Value { get; set; } = default!;

    public string ConfigToken { get; set; } = null!;

    public long GenerationId { get; set; }
  }
}
