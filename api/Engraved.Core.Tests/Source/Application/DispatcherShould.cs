﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using NUnit.Framework;

namespace Engraved.Core.Application;

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
    await dispatcher1.Command(new FakeCommand { AffectedUsers = new List<string> { "user_zero", "user_one" } });

    Guid resultSecondExecution = await dispatcher1.Query<Guid, FakeQuery>(query);
    resultFirstExecution.Should().NotBe(resultSecondExecution);

    Guid secondResultOtherUser = await dispatcher0.Query<Guid, FakeQuery>(query);
    firstResultOtherUser.Should().NotBe(secondResultOtherUser);
  }

  private Dispatcher CreateDispatcher(string userName)
  {
    var currentUser = new Lazy<IUser>(() => new User { Id = userName, Name = userName });
    var queryCache = new QueryCache(NullLogger<QueryCache>.Instance, _memoryCache, currentUser);

    return new Dispatcher(
      NullLogger<Dispatcher>.Instance,
      new TestServiceProvider(null!),
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

public class FakeUserScopedRepository(Lazy<IUser> currentUser) : IUserScopedRepository
{
  public Lazy<IUser> CurrentUser => currentUser;

  public Task<IUser?> GetUser(string nameOrId)
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
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
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

  public Task<IEntry[]> GetEntriesForJournal(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues,
    string? searchText
  )
  {
    throw new NotImplementedException();
  }

  public Task<IEntry[]> SearchEntries(
    string? searchText,
    ScheduleMode? scheduleMode = null,
    JournalType[]? journalTypes = null,
    string[]? journalIds = null,
    int? limit = null,
    string? currentUserId = null
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

  public Task<long> CountAllUsers()
  {
    throw new NotImplementedException();
  }

  public Task<long> CountAllEntries()
  {
    throw new NotImplementedException();
  }

  public Task<long> CountAllJournals()
  {
    throw new NotImplementedException();
  }
}
