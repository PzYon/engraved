using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries;

public class QueryCacheShould
{
  [Test]
  public void ClearCurrentUserCacheWithoutAffectingOtherUsers()
  {
    using var memoryCache = new MemoryCache(new MemoryCacheOptions());

    var queryExecutor = new FakeCacheQueryExecutor();
    var query = new FakeCacheQuery { Token = "123" };

    var userOneCache = new QueryCache(
      NullLogger<QueryCache>.Instance,
      memoryCache,
      new Lazy<IUser>(() => new User { Id = "user_one", Name = "user_one" })
    );
    var userTwoCache = new QueryCache(
      NullLogger<QueryCache>.Instance,
      memoryCache,
      new Lazy<IUser>(() => new User { Id = "user_two", Name = "user_two" })
    );

    userOneCache.Set(query, "cached-value-user-one", userOneCache.GetGenerationId());
    userTwoCache.Set(query, "cached-value-user-two", userTwoCache.GetGenerationId());

    userOneCache.ClearCurrentUser();

    userOneCache.TryGetValue(query, out string? userOneResult).Should().BeFalse();
    userOneResult.Should().BeNull();

    userTwoCache.TryGetValue(query, out string? userTwoResult).Should().BeTrue();
    userTwoResult.Should().Be("cached-value-user-two");
  }

  [Test]
  public void IgnoreValueCachedWithAGenerationThatWasInvalidatedDuringTheQuery()
  {
    using var memoryCache = new MemoryCache(new MemoryCacheOptions());

    var queryExecutor = new FakeCacheQueryExecutor();
    var query = new FakeCacheQuery { Token = "123" };

    var cache = new QueryCache(
      NullLogger<QueryCache>.Instance,
      memoryCache,
      new Lazy<IUser>(() => new User { Id = "user", Name = "user" })
    );

    // Simulate a query that read its data (capturing the generation), then an
    // invalidation that happened before the query wrote its result to the cache.
    var generation = cache.GetGenerationId();
    cache.Invalidate(["user"]);
    cache.Set(query, "stale-value", generation);

    cache.TryGetValue(query, out string? result).Should().BeFalse();
    result.Should().BeNull();
  }

  [Test]
  public void ReturnValueCachedWithTheCurrentGeneration()
  {
    using var memoryCache = new MemoryCache(new MemoryCacheOptions());

    var queryExecutor = new FakeCacheQueryExecutor();
    var query = new FakeCacheQuery { Token = "123" };

    var cache = new QueryCache(
      NullLogger<QueryCache>.Instance,
      memoryCache,
      new Lazy<IUser>(() => new User { Id = "user", Name = "user" })
    );

    cache.Set(query, "fresh-value", cache.GetGenerationId());

    cache.TryGetValue(query, out string? result).Should().BeTrue();
    result.Should().Be("fresh-value");
  }

  private class FakeCacheQuery : IQuery
  {
    public string Token { get; set; } = string.Empty;
  }

  private class FakeCacheQueryExecutor : IQueryExecutor<string, FakeCacheQuery>
  {
    public bool DisableCache => false;

    public Task<string> Execute(FakeCacheQuery query)
    {
      return Task.FromResult("executor-value");
    }
  }
}
