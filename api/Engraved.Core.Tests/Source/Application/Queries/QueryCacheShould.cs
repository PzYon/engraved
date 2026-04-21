using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Queries;
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

    userOneCache.Set(queryExecutor, query, "cached-value-user-one");
    userTwoCache.Set(queryExecutor, query, "cached-value-user-two");

    userOneCache.ClearCurrentUser();

    userOneCache.TryGetValue(queryExecutor, query, out string? userOneResult).Should().BeFalse();
    userOneResult.Should().BeNull();

    userTwoCache.TryGetValue(queryExecutor, query, out string? userTwoResult).Should().BeTrue();
    userTwoResult.Should().Be("cached-value-user-two");
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
