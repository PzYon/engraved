using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

namespace Metrix.Core.Application.Queries;

public class QueryCache
{
  private class CacheItem<TResult>
  {
    public TResult Value { get; set; }

    public int ConfigHash { get; set; }
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
        ConfigHash = GetConfigHash(query)
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

    if (cacheItem.ConfigHash != GetConfigHash(query))
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

  private static int GetConfigHash<TValue>(IQuery<TValue> query)
  {
    return JsonSerializer.Serialize(query).GetHashCode();
  }
}
