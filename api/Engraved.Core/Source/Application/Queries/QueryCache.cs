﻿using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace Engraved.Core.Application.Queries;

public class QueryCache
{
  private const string KeysByUserId = "___keysByUserId";

  private readonly IMemoryCache _memoryCache;
  private readonly Lazy<IUser> _currentUser;

  public QueryCache(IMemoryCache memoryCache, IUserScopedRepository repository)
  {
    _memoryCache = memoryCache;
    _currentUser = repository.CurrentUser;
  }

  private Dictionary<string, HashSet<string>> QueryKeysByUser
    => _memoryCache.GetOrCreate(KeysByUserId, _ => new Dictionary<string, HashSet<string>>())!;

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

  public void Invalidate(string[] affectedUserIds)
  {
    foreach (string user in affectedUserIds)
    {
      ClearForUser(user);
    }
  }

  private void ClearForUser(string userName)
  {
    if (!QueryKeysByUser.TryGetValue(userName, out HashSet<string>? keys))
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
    return _currentUser.Value.Id + "_" + queryExecutor.GetType().FullName!;
  }

  private static string GetConfigToken<TValue>(IQuery<TValue> query)
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
    string? userId = _currentUser.Value.Id;
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
