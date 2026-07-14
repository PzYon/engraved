using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Queries;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application;

public class DispatcherShould
{
  private IMemoryCache _memoryCache = null!;

  [TearDown]
  public void Dispose()
  {
    _memoryCache.Dispose();
  }

  [SetUp]
  public void SetUp()
  {
    _memoryCache = new MemoryCache(new MemoryCacheOptions());
  }

  [Test]
  public async Task ExecuteQuery()
  {
    var query = new FakeQuery();

    Dispatcher d = CreateDispatcher("xyz");
    Guid guid = await d.Query<Guid, FakeQuery>(query);

    guid.Should().NotBe(Guid.Empty);
  }

  [Test]
  public async Task ExecuteQueryWithCache()
  {
    var query = new FakeQuery();

    Dispatcher d = CreateDispatcher("xyz");

    Guid resultFirstExecution = await d.Query<Guid, FakeQuery>(query);
    Guid resultSecondExecution = await d.Query<Guid, FakeQuery>(query);

    resultFirstExecution.Should().Be(resultSecondExecution);
  }

  [Test]
  public async Task ExecuteQueryWithCacheWithDifferentConfig()
  {
    Dispatcher d = CreateDispatcher("xyz");

    Guid resultFirstExecution = await d.Query<Guid, FakeQuery>(new FakeQuery { DummyValue = "123" });
    Guid resultSecondExecution = await d.Query<Guid, FakeQuery>(new FakeQuery { DummyValue = "456" });

    resultFirstExecution.Should().NotBe(resultSecondExecution);
  }

  [Test]
  public async Task CachePerUser()
  {
    var query = new FakeQuery { DummyValue = "123" };

    Dispatcher dispatcherUser1 = CreateDispatcher("user_one");
    Guid resultUser1 = await dispatcherUser1.Query<Guid, FakeQuery>(query);

    Dispatcher dispatcherUser2 = CreateDispatcher("user_two");
    Guid resultUser2 = await dispatcherUser2.Query<Guid, FakeQuery>(query);

    resultUser1.Should().NotBe(resultUser2);
  }

  [Test]
  public async Task ResetCachePerUserAfterCommand()
  {
    var query = new FakeQuery();

    Dispatcher dispatcher0 = CreateDispatcher("user_zero");
    Guid firstResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);

    Dispatcher dispatcher1 = CreateDispatcher("user_one");
    Guid resultFirstExecution = await dispatcher1.Query<Guid, FakeQuery>(query);
    await dispatcher1.Command(new FakeCommand());
    Guid resultSecondExecution = await dispatcher1.Query<Guid, FakeQuery>(query);
    resultFirstExecution.Should().NotBe(resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);
    firstResultOtherUser.Should().Be(secondResultOtherUser);
  }

  [Test]
  public async Task ResetCachePerAffectedUserAfterCommand()
  {
    var query = new FakeQuery();

    Dispatcher dispatcher0 = CreateDispatcher("user_zero");
    Guid firstResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);

    Dispatcher dispatcher1 = CreateDispatcher("user_one");
    Guid resultFirstExecution = await dispatcher1.Query<Guid, FakeQuery>(query);
    await dispatcher1.Command(new FakeCommand { AffectedUsers = ["user_zero", "user_one"] });

    Guid resultSecondExecution = await dispatcher1.Query<Guid, FakeQuery>(query);
    resultFirstExecution.Should().NotBe(resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);
    firstResultOtherUser.Should().NotBe(secondResultOtherUser);
  }

  [Test]
  public async Task Parallel()
  {
    // we use the same queryCache instance to simulate multiple request from the
    // same user at the same time.
    var currentUser = new Lazy<IUser>(() => new User { Id = "user_one", Name = "user_one" });
    var queryCache = new QueryCache(NullLogger<QueryCache>.Instance, _memoryCache, currentUser);

    var parallelTaskCount = 10;
    var actionPerTaskCount = 100;

    var tasks = new Task[parallelTaskCount];

    for (var taskIndex = 0; taskIndex < parallelTaskCount; taskIndex++)
    {
      tasks[taskIndex] = Task.Run(async () =>
        {
          for (var actionIndex = 0; actionIndex < actionPerTaskCount; actionIndex++)
          {
            Dispatcher dispatcher = CreateDispatcher("user_one", queryCache);
            await dispatcher.Query<Guid, FakeQuery>(new FakeQuery());
            await dispatcher.Command(new FakeCommand { AffectedUsers = ["user_zero", "user_one"] });
          }
        }
      );
    }

    await Task.WhenAll(tasks);
  }

  private Dispatcher CreateDispatcher(string userName, QueryCache? queryCache = null)
  {
    var currentUser = new Lazy<IUser>(() => new User { Id = userName, Name = userName });
    queryCache ??= new QueryCache(NullLogger<QueryCache>.Instance, _memoryCache, currentUser);

    return new Dispatcher(
      NullLogger<Dispatcher>.Instance,
      new TestServiceProvider(null!),
      currentUser,
      queryCache
    );
  }
}

public class FakeCommand : ICommand
{
  public List<string> AffectedUsers { get; set; } = new();
}

public class FakeCommandExecutor : ICommandExecutor<FakeCommand>
{
  public Task<CommandResult> Execute(FakeCommand command)
  {
    return Task.FromResult(new CommandResult("123", command.AffectedUsers.ToArray()));
  }
}

public class FakeQuery : IQuery
{
  public string? DummyValue { get; set; }
}

public class FakeQueryExecutor : IQueryExecutor<Guid, FakeQuery>
{
  public bool DisableCache => false;

  public Task<Guid> Execute(FakeQuery query)
  {
    return Task.FromResult(Guid.NewGuid());
  }
}
