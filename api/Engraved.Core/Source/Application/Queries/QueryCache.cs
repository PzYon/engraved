using Engraved.Core.Domain.Users;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Engraved.Core.Application.Queries;

public class QueryCache(ILogger<QueryCache> logger, IMemoryCache memoryCache, Lazy<IUser> currentUser)
{
  private const string KeysByUserId = "___keysByUserId";

  private Dictionary<string, HashSet<string>> QueryKeysByUser
    => memoryCache.GetOrCreate(KeysByUserId, _ => new Dictionary<string, HashSet<string>>())!;

  public void Set<TValue, TQuery>(IQueryExecutor<TValue, TQuery> queryExecutor, TQuery query, TValue value)
    where TQuery : IQuery
  {
    var key = GetKey(queryExecutor);

    RememberQueryKeyForUser(key);

    memoryCache.Set(
      key,
      new CacheItem<TValue>
      {
        Value = value,
        ConfigToken = GetConfigToken(query)
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

    var configToken = GetConfigToken(query);
    if (cacheItem!.ConfigToken != configToken)
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

  private void ClearForUser(string userName)
  {
    if (!QueryKeysByUser.TryGetValue(userName, out var keys) || !keys.Any())
    {
      return;
    }

    logger.LogInformation("Invalidating cache for user {UserName}, {ValueCount} items affected", userName, keys.Count);

    foreach (var key in keys)
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
    if (!QueryKeysByUser.TryGetValue(GetUserId(), out var queryKeys))
    {
      queryKeys = [];
      QueryKeysByUser.Add(GetUserId(), queryKeys);
    }

    queryKeys.Add(queryKey);
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
  }
}
