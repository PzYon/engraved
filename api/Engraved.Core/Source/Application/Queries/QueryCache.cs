using Engraved.Core.Domain.User;
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
    string key = GetKey(queryExecutor);

    RememberQueryKeyForUser(key);

    memoryCache.Set(
      key,
      new CacheItem<TValue>
      {
        Value = value,
        ConfigToken = GetConfigToken(query)
      }
    );
  }

  public bool TryGetValue<TValue, TQuery>(IQueryExecutor<TValue, TQuery> queryExecutor, TQuery query, out TValue? value)
    where TQuery : IQuery
  {
    string key = GetKey(queryExecutor);

    if (!memoryCache.TryGetValue(key, out CacheItem<TValue>? cacheItem))
    {
      logger.LogInformation($"{key}: Cache miss (not available)");
      value = default;
      return false;
    }

    string configToken = GetConfigToken(query);
    if (cacheItem!.ConfigToken != configToken)
    {
      logger.LogInformation($"{key}: Cache miss (different token): {configToken}");
      value = default!;
      return false;
    }

    logger.LogInformation($"{key}: Cache hit");
    value = cacheItem.Value;
    return true;
  }

  public void Invalidate(string[] affectedUserIds)
  {
    foreach (string user in affectedUserIds)
    {
      ClearForUser(user);
    }
  }

  private void ClearForUser(string userName)
  {
    if (!QueryKeysByUser.TryGetValue(userName, out HashSet<string>? keys) || !keys.Any())
    {
      return;
    }

    logger.LogInformation($"Invalidating cache for user {userName}, {keys.Count} items affected");

    foreach (string key in keys)
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
    if (!QueryKeysByUser.TryGetValue(GetUserId(), out HashSet<string>? queryKeys))
    {
      queryKeys = new HashSet<string>();
      QueryKeysByUser.Add(GetUserId(), queryKeys);
    }

    queryKeys.Add(queryKey);
  }

  private string GetUserId()
  {
    string? userId = currentUser.Value.Id;
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
