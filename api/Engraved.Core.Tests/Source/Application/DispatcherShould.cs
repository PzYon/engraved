using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;

namespace Engraved.Core.Application;

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

    Dispatcher d = CreateDispatcher("xyz");
    Guid guid = await d.Query(query);

    Assert.IsTrue(guid != Guid.Empty);
  }

  [Test]
  public async Task ExecuteQueryWithCache()
  {
    var query = new FakeQuery();

    Dispatcher d = CreateDispatcher("xyz");

    Guid resultFirstExecution = await d.Query(query);
    Guid resultSecondExecution = await d.Query(query);

    Assert.AreEqual(resultFirstExecution, resultSecondExecution);
  }

  [Test]
  public async Task ExecuteQueryWithCacheWithDifferentConfig()
  {
    Dispatcher d = CreateDispatcher("xyz");

    Guid resultFirstExecution = await d.Query(new FakeQuery { DummyValue = "123" });
    Guid resultSecondExecution = await d.Query(new FakeQuery { DummyValue = "456" });

    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);
  }

  [Test]
  public async Task CachePerUser()
  {
    var query = new FakeQuery { DummyValue = "123" };

    Dispatcher dispatcherUser1 = CreateDispatcher("user_one");
    Guid resultUser1 = await dispatcherUser1.Query(query);

    Dispatcher dispatcherUser2 = CreateDispatcher("user_two");
    Guid resultUser2 = await dispatcherUser2.Query(query);

    Assert.AreNotEqual(resultUser1, resultUser2);
  }

  [Test]
  public async Task ResetCachePerUserAfterCommand()
  {
    var query = new FakeQuery();

    Dispatcher dispatcher0 = CreateDispatcher("user_zero");
    Guid firstResultOtherUser = await dispatcher0.Query(query);

    Dispatcher dispatcher1 = CreateDispatcher("user_one");
    Guid resultFirstExecution = await dispatcher1.Query(query);
    await dispatcher1.Command(new FakeCommand());
    Guid resultSecondExecution = await dispatcher1.Query(query);
    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query(query);
    Assert.AreEqual(firstResultOtherUser, secondResultOtherUser);
  }

  [Test]
  public async Task ResetCachePerAffectedUserAfterCommand()
  {
    var query = new FakeQuery();

    Dispatcher dispatcher0 = CreateDispatcher("user_zero");
    Guid firstResultOtherUser = await dispatcher0.Query(query);

    Dispatcher dispatcher1 = CreateDispatcher("user_one");
    Guid resultFirstExecution = await dispatcher1.Query(query);
    await dispatcher1.Command(new FakeCommand { AffectedUsers = new List<string> { "user_zero", "user_one" } });
    
    Guid resultSecondExecution = await dispatcher1.Query(query);
    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query(query);
    Assert.AreNotEqual(firstResultOtherUser, secondResultOtherUser);
  }

  private Dispatcher CreateDispatcher(string userName)
  {
    var currentUser = new Lazy<IUser>(() => new User { Id = userName, Name = userName });
    var queryCache = new QueryCache(_memoryCache, currentUser);

    return new Dispatcher(new FakeUserScopedRepository(currentUser), null!, queryCache);
  }
}

public class FakeCommand : ICommand
{
  public List<string> AffectedUsers { get; set; } = new();

  public ICommandExecutor CreateExecutor()
  {
    return new FakeCommandExecutor(AffectedUsers);
  }
}

public class FakeCommandExecutor : ICommandExecutor
{
  private readonly List<string> _affectedUsers;

  public FakeCommandExecutor(List<string> affectedUsers)
  {
    _affectedUsers = affectedUsers;
  }

  public Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    return Task.FromResult(new CommandResult("123", _affectedUsers.ToArray()));
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

public class FakeUserScopedRepository : IUserScopedRepository
{
  public Lazy<IUser> CurrentUser { get; }

  public FakeUserScopedRepository(Lazy<IUser> currentUser)
  {
    CurrentUser = currentUser;
  }

  public Task<IUser?> GetUser(string name)
  {
    throw new NotImplementedException();
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    throw new NotImplementedException();
  }

  public Task<IUser[]> GetUsers(params string[] userIds)
  {
    throw new NotImplementedException();
  }

  public Task<IUser[]> GetAllUsers()
  {
    throw new NotImplementedException();
  }

  public Task<IMetric[]> GetAllMetrics(string? searchText = null, MetricType[]? metricTypes = null, int? limit = null)
  {
    throw new NotImplementedException();
  }

  public Task<IMetric?> GetMetric(string metricId)
  {
    throw new NotImplementedException();
  }

  public Task<UpsertResult> UpsertMetric(IMetric metric)
  {
    throw new NotImplementedException();
  }

  public Task DeleteMetric(string metricId)
  {
    throw new NotImplementedException();
  }

  public Task ModifyMetricPermissions(string metricId, Dictionary<string, PermissionKind> permissions)
  {
    throw new NotImplementedException();
  }

  public Task<IMeasurement[]> GetAllMeasurements(
    string metricId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  )
  {
    throw new NotImplementedException();
  }

  public Task<IMeasurement[]> GetLastEditedMeasurements(
    string[]? metricIds,
    string? searchText,
    MetricType[]? metricTypes,
    int limit
  )
  {
    throw new NotImplementedException();
  }

  public Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    throw new NotImplementedException();
  }

  public Task DeleteMeasurement(string measurementId)
  {
    throw new NotImplementedException();
  }

  public Task<IMeasurement?> GetMeasurement(string measurementId)
  {
    throw new NotImplementedException();
  }

  public Task WakeMeUp()
  {
    throw new NotImplementedException();
  }
}
