using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace Engraved.Core.Application.Queries;

public class QueryCache
{
  private const string KeysByUserKey = "___keysByUser";

  private readonly IMemoryCache _memoryCache;
  private readonly ICurrentUserService _currentUserService;

  public QueryCache(IMemoryCache memoryCache, ICurrentUserService currentUserService)
  {
    _memoryCache = memoryCache;
    _currentUserService = currentUserService;
  }

  private Dictionary<string, HashSet<string>> QueryKeysByUser
    => _memoryCache.GetOrCreate(KeysByUserKey, _ => new Dictionary<string, HashSet<string>>())!;

  public void Set<TValue>(IQueryExecutor<TValue> queryExecutor, IQuery<TValue> query, TValue value)
  {
    string key = GetKey(queryExecutor);

    RememberQueryKeyForUser(key);

    _memoryCache.Set(
      key,
      new CacheItem<TValue>
      {
        Value = value,
        ConfigToken = GetConfigToken(query)
      }
    );
  }

  public bool TryGetValue<TValue>(IQueryExecutor<TValue> queryExecutor, IQuery<TValue> query, out TValue? value)
  {
    if (!_memoryCache.TryGetValue(GetKey(queryExecutor), out CacheItem<TValue>? cacheItem))
    {
      value = default;
      return false;
    }

    if (cacheItem!.ConfigToken != GetConfigToken(query))
    {
      value = default!;
      return false;
    }

    value = cacheItem.Value;
    return true;
  }

  public void ClearForCurrentUser()
  {
    if (!QueryKeysByUser.TryGetValue(GetUserName(), out HashSet<string>? keys))
    {
      return;
    }

    foreach (string key in keys)
    {
      _memoryCache.Remove(key);
    }
  }

  private string GetKey<TValue>(IQueryExecutor<TValue> queryExecutor)
  {
    return _currentUserService.GetUserName() + "_" + queryExecutor.GetType().FullName!;
  }

  private static string GetConfigToken<TValue>(IQuery<TValue> query)
  {
    return JsonConvert.SerializeObject(query);
  }

  private void RememberQueryKeyForUser(string queryKey)
  {
    if (!QueryKeysByUser.TryGetValue(GetUserName(), out HashSet<string>? queryKeys))
    {
      queryKeys = new HashSet<string>();
      QueryKeysByUser.Add(GetUserName(), queryKeys);
    }

    queryKeys.Add(queryKey);
  }

  private string GetUserName()
  {
    string? userName = _currentUserService.GetUserName();
    if (string.IsNullOrEmpty(userName))
    {
      throw new Exception("Username is not available.");
    }

    return userName;
  }

  private class CacheItem<TResult>
  {
    public TResult Value { get; set; } = default!;

    public string ConfigToken { get; set; } = null!;
  }
}
