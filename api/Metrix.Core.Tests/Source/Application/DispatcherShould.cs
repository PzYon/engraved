using System;
using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;
using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;

namespace Metrix.Core.Application;

public class DispatcherShould
{
  [Test]
  public async Task ExecuteQuery()
  {
    var query = new FakeQuery();

    var d = new Dispatcher(null!, null!, new MemoryCache(new MemoryCacheOptions()));
    Guid guid = await d.Query(query);

    Assert.IsTrue(guid != Guid.Empty);
  }

  [Test]
  public async Task ExecuteQueryWithCache()
  {
    var query = new FakeQuery();

    var d = new Dispatcher(null!, null!, new MemoryCache(new MemoryCacheOptions()));

    Guid resultFirstExecution = await d.Query(query);
    Guid resultSecondExecution = await d.Query(query);

    Assert.AreEqual(resultFirstExecution, resultSecondExecution);
  }
}

public class FakeQuery : IQuery<Guid>
{
  public IQueryExecutor<Guid> CreateExecutor()
  {
    return new FakeQueryExecutor();
  }
}

public class FakeQueryExecutor : IQueryExecutor<Guid>
{
  public bool DisableCache => false;

  public Task<Guid> Execute(IRepository repository)
  {
    return Task.FromResult(Guid.NewGuid());
  }
}
