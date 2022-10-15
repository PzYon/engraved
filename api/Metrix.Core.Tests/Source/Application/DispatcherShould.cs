using System;
using System.Threading.Tasks;
using Metrix.Core.Application.Commands;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Queries;
using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;

namespace Metrix.Core.Application;

public class DispatcherShould
{
  private IMemoryCache _memoryCache = null!;

  [SetUp]
  public void SetUp()
  {
    _memoryCache = new MemoryCache(new MemoryCacheOptions());
  }

  [Test]
  public async Task ExecuteQuery()
  {
    var query = new FakeQuery();

    var d = new Dispatcher(null!, null!, CreateQueryCache());
    Guid guid = await d.Query(query);

    Assert.IsTrue(guid != Guid.Empty);
  }

  [Test]
  public async Task ExecuteQueryWithCache()
  {
    var query = new FakeQuery();

    var d = new Dispatcher(null!, null!, CreateQueryCache());

    Guid resultFirstExecution = await d.Query(query);
    Guid resultSecondExecution = await d.Query(query);

    Assert.AreEqual(resultFirstExecution, resultSecondExecution);
  }

  [Test]
  public async Task ExecuteQueryWithCacheWithDifferentConfig()
  {
    var d = new Dispatcher(null!, null!, CreateQueryCache());

    Guid resultFirstExecution = await d.Query(new FakeQuery { DummyValue = "123" });
    Guid resultSecondExecution = await d.Query(new FakeQuery { DummyValue = "456" });

    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);
  }

  [Test]
  public async Task CachePerUser()
  {
    var query = new FakeQuery { DummyValue = "123" };

    var dispatcherUser1 = new Dispatcher(null!, null!, CreateQueryCache("user_one"));
    Guid resultUser1 = await dispatcherUser1.Query(query);

    var dispatcherUser2 = new Dispatcher(null!, null!, CreateQueryCache("user_two"));
    Guid resultUser2 = await dispatcherUser2.Query(query);

    Assert.AreNotEqual(resultUser1, resultUser2);
  }

  [Test]
  public async Task ResetCachePerUserAfterCommand()
  {
    var query = new FakeQuery();

    var dispatcher0 = new Dispatcher(null!, null!, CreateQueryCache("user_zero"));
    Guid firstResultOtherUser = await dispatcher0.Query(query);

    var dispatcher1 = new Dispatcher(null!, null!, CreateQueryCache("user_one"));
    Guid resultFirstExecution = await dispatcher1.Query(query);
    await dispatcher1.Command(new FakeCommand());
    Guid resultSecondExecution = await dispatcher1.Query(query);
    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query(query);
    Assert.AreEqual(firstResultOtherUser, secondResultOtherUser);
  }

  private QueryCache CreateQueryCache(string userName = "random")
  {
    return new QueryCache(_memoryCache, new FakeCurrentUserService(userName));
  }
}

public class FakeCurrentUserService : ICurrentUserService
{
  private string? _userName;

  public FakeCurrentUserService(string? userName)
  {
    _userName = userName;
  }

  public string? GetUserName()
  {
    return _userName;
  }

  public void SetUserName(string userName)
  {
    _userName = userName;
  }
}

public class FakeCommand : ICommand
{
  public ICommandExecutor CreateExecutor()
  {
    return new FakeCommandExecutor();
  }
}

public class FakeCommandExecutor : ICommandExecutor
{
  public Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    return Task.FromResult(new CommandResult());
  }
}

public class FakeQuery : IQuery<Guid>
{
  public string? DummyValue { get; set; }

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
