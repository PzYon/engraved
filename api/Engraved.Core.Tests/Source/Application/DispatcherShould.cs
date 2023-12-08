using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
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
    Guid guid = await d.Query<Guid, FakeQuery>(query);

    Assert.IsTrue(guid != Guid.Empty);
  }

  [Test]
  public async Task ExecuteQueryWithCache()
  {
    var query = new FakeQuery();

    Dispatcher d = CreateDispatcher("xyz");

    Guid resultFirstExecution = await d.Query<Guid, FakeQuery>(query);
    Guid resultSecondExecution = await d.Query<Guid, FakeQuery>(query);

    Assert.AreEqual(resultFirstExecution, resultSecondExecution);
  }

  [Test]
  public async Task ExecuteQueryWithCacheWithDifferentConfig()
  {
    Dispatcher d = CreateDispatcher("xyz");

    Guid resultFirstExecution = await d.Query<Guid, FakeQuery>(new FakeQuery { DummyValue = "123" });
    Guid resultSecondExecution = await d.Query<Guid, FakeQuery>(new FakeQuery { DummyValue = "456" });

    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);
  }

  [Test]
  public async Task CachePerUser()
  {
    var query = new FakeQuery { DummyValue = "123" };

    Dispatcher dispatcherUser1 = CreateDispatcher("user_one");
    Guid resultUser1 = await dispatcherUser1.Query<Guid, FakeQuery>(query);

    Dispatcher dispatcherUser2 = CreateDispatcher("user_two");
    Guid resultUser2 = await dispatcherUser2.Query<Guid, FakeQuery>(query);

    Assert.AreNotEqual(resultUser1, resultUser2);
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
    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);
    Assert.AreEqual(firstResultOtherUser, secondResultOtherUser);
  }

  [Test]
  public async Task ResetCachePerAffectedUserAfterCommand()
  {
    var query = new FakeQuery();

    Dispatcher dispatcher0 = CreateDispatcher("user_zero");
    Guid firstResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);

    Dispatcher dispatcher1 = CreateDispatcher("user_one");
    Guid resultFirstExecution = await dispatcher1.Query<Guid, FakeQuery>(query);
    await dispatcher1.Command(new FakeCommand { AffectedUsers = new List<string> { "user_zero", "user_one" } });

    Guid resultSecondExecution = await dispatcher1.Query<Guid, FakeQuery>(query);
    Assert.AreNotEqual(resultFirstExecution, resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);
    Assert.AreNotEqual(firstResultOtherUser, secondResultOtherUser);
  }

  private Dispatcher CreateDispatcher(string userName)
  {
    var currentUser = new Lazy<IUser>(() => new User { Id = userName, Name = userName });
    var queryCache = new QueryCache(_memoryCache, currentUser);

    return new Dispatcher(
      new TestServiceProvider(null!, null!),
      new FakeUserScopedRepository(currentUser),
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

  public Task<IJournal[]> GetAllJournals(
    string? searchText = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null
  )
  {
    throw new NotImplementedException();
  }

  public Task<IJournal?> GetJournal(string journalId)
  {
    throw new NotImplementedException();
  }

  public Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    throw new NotImplementedException();
  }

  public Task DeleteJournal(string journalId)
  {
    throw new NotImplementedException();
  }

  public Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions)
  {
    throw new NotImplementedException();
  }

  public Task<IEntry[]> GetAllEntries(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  )
  {
    throw new NotImplementedException();
  }

  public Task<IEntry[]> GetLastEditedEntries(
    string[]? journalIds,
    string? searchText,
    JournalType[]? journalTypes,
    int limit
  )
  {
    throw new NotImplementedException();
  }

  public Task<UpsertResult> UpsertEntry<TEntry>(TEntry entry) where TEntry : IEntry
  {
    throw new NotImplementedException();
  }

  public Task DeleteEntry(string entryId)
  {
    throw new NotImplementedException();
  }

  public Task<IEntry?> GetEntry(string entryId)
  {
    throw new NotImplementedException();
  }

  public Task WakeMeUp()
  {
    throw new NotImplementedException();
  }
}
