using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace Metrix.Core.Application.Queries;

public class QueryCache
{
  private class CacheItem<TResult>
  {
    public TResult Value { get; set; }

    public string ConfigToken { get; set; }
  }

  private readonly IMemoryCache _memoryCache;

  public QueryCache(IMemoryCache memoryCache)
  {
    _memoryCache = memoryCache;
  }

  public void Set<TValue>(IQueryExecutor<TValue> queryExecutor, IQuery<TValue> query, TValue value)
  {
    _memoryCache.Set(
      GetKey(queryExecutor),
      new CacheItem<TValue>
      {
        Value = value,
        ConfigToken = GetConfigToken(query)
      }
    );
  }

  public bool TryGetValue<TValue>(IQueryExecutor<TValue> queryExecutor, IQuery<TValue> query, out TValue value)
  {
    value = default!;

    if (!_memoryCache.TryGetValue(GetKey(queryExecutor), out CacheItem<TValue> cacheItem))
    {
      return false;
    }

    if (cacheItem.ConfigToken != GetConfigToken(query))
    {
      return false;
    }

    value = cacheItem.Value;
    return true;
  }

  private static string GetKey<TValue>(IQueryExecutor<TValue> queryExecutor)
  {
    return queryExecutor.GetType().FullName!;
  }

  private static string GetConfigToken<TValue>(IQuery<TValue> query)
  {
    return JsonConvert.SerializeObject(query);
  }
}
