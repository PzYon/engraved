using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Journals.AddSchedule;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Search;

public class SearchEntitiesQueryExecutorShould
{
  private InMemoryRepository _testRepository = null!;
  private FakeDateService _dateService = null!;
  private UserScopedInMemoryRepository _userScopedInMemoryRepository = null!;
  private SearchEntitiesQueryExecutor _searchExecutor = null!;

  [SetUp]
  public async Task SetUp()
  {
    _testRepository = new InMemoryRepository();

    await _testRepository.UpsertUser(new User { Name = "max" });

    _userScopedInMemoryRepository = new UserScopedInMemoryRepository(
      _testRepository,
      new FakeCurrentUserService("max")
    );

    _dateService = new FakeDateService();

    _searchExecutor = new SearchEntitiesQueryExecutor(
      new Dispatcher(
        new TestServiceProvider(_userScopedInMemoryRepository),
        _userScopedInMemoryRepository,
        new QueryCache(new MemoryCache(new MemoryCacheOptions()), _userScopedInMemoryRepository.CurrentUser)
      )
    );
  }

  [Test]
  public async Task FindEntriesAndJournal()
  {
    await AddJournalToFindWithTwoEntriesToIgnore();
    await AddJournalToIgnoreWithOneEntryToFind();

    SearchEntitiesResult result = await _searchExecutor.Execute(new SearchEntitiesQuery { SearchText = "Yes" });

    result.Entities.Length.Should().Be(2);
    result.Entities.Count(e => e.EntityType == EntityType.Journal).Should().Be(1);

    result.Entities.Where(e => e.EntityType == EntityType.Journal)
      .Count(e => ((IJournal) e.Entity).Name == "Yes")
      .Should()
      .Be(1);

    result.Entities.Count(e => e.EntityType == EntityType.Entry).Should().Be(1);

    result.Journals.Length.Should().Be(1);
    result.Journals[0].Name.Should().Be("No");
  }

  [Test]
  public async Task FindEntriesAndJournalWithScheduledOnly()
  {
    // both of these should not be found as they have no schedule
    await AddJournalToFindWithTwoEntriesToIgnore();
    await AddJournalToIgnoreWithOneEntryToFind();

    await AddEntitiesWithSchedule();

    SearchEntitiesResult result = await _searchExecutor.Execute(
      new SearchEntitiesQuery
      {
        SearchText = "Schedule",
        ScheduledOnly = true
      }
    );

    result.Journals.Length.Should().Be(0);
    result.Entities.Length.Should().Be(1);
  }

  private async Task AddEntitiesWithSchedule()
  {
    var addJournalExecutor = new AddJournalCommandExecutor(_userScopedInMemoryRepository, _dateService);
    CommandResult commandResult = await addJournalExecutor.Execute(
      new AddJournalCommand
      {
        Name = "Journal with Schedule",
        Type = JournalType.Scraps
      }
    );

    var addScheduleExecutor = new AddScheduleToJournalCommandExecutor(_userScopedInMemoryRepository);
    await addScheduleExecutor.Execute(
      new AddScheduleToJournalCommand
      {
        JournalId = commandResult.EntityId,
        NextOccurrence = _dateService.UtcNow.AddDays(10)
      }
    );

    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_userScopedInMemoryRepository, _dateService);
    await addEntryExecutor.Execute(
      new UpsertScrapsEntryCommand
      {
        JournalId = commandResult.EntityId,
        DateTime = _dateService.UtcNow,
        Notes = "Entry with Schedule"
      }
    );
  }

  private async Task AddJournalToIgnoreWithOneEntryToFind()
  {
    var addJournalExecutor = new AddJournalCommandExecutor(_userScopedInMemoryRepository, _dateService);
    CommandResult commandResult = await addJournalExecutor.Execute(
      new AddJournalCommand
      {
        Name = "No",
        Type = JournalType.Scraps
      }
    );

    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_userScopedInMemoryRepository, _dateService);
    await addEntryExecutor.Execute(
      new UpsertScrapsEntryCommand
      {
        JournalId = commandResult.EntityId,
        DateTime = _dateService.UtcNow,
        Notes = "Yes"
      }
    );
  }

  private async Task AddJournalToFindWithTwoEntriesToIgnore()
  {
    var addJournalExecutor = new AddJournalCommandExecutor(_userScopedInMemoryRepository, _dateService);
    CommandResult commandResult = await addJournalExecutor.Execute(
      new AddJournalCommand
      {
        Name = "Yes",
        Type = JournalType.Scraps
      }
    );

    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_userScopedInMemoryRepository, _dateService);
    await addEntryExecutor.Execute(
      new UpsertScrapsEntryCommand
      {
        JournalId = commandResult.EntityId,
        DateTime = _dateService.UtcNow,
        Notes = "i am a simple text - I"
      }
    );

    await addEntryExecutor.Execute(
      new UpsertScrapsEntryCommand
      {
        JournalId = commandResult.EntityId,
        DateTime = _dateService.UtcNow,
        Notes = "i am a simple text - II"
      }
    );
  }
}
