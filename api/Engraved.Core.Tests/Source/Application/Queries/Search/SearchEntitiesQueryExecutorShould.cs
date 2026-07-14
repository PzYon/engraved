using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.AddSchedule;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Journals.AddSchedule;
using Engraved.TestUtils;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Search;

public class SearchEntitiesQueryExecutorShould
{
  private FakeDateService _dateService = null!;
  private SearchEntitiesQueryExecutor _searchExecutor = null!;
  private TestUserRestrictedMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    const string userId = TestIds.UserId;
    _repo = await Util.CreateUserRestrictedMongoRepository(userId, userId, false);

    await _repo.UpsertUser(new User { Id = userId, Name = userId });

    var fakeCurrentUserService = new FakeCurrentUserService(userId);

    _dateService = new FakeDateService();

    _searchExecutor = new SearchEntitiesQueryExecutor(
      new Dispatcher(
        NullLogger<Dispatcher>.Instance,
        new TestServiceProvider(_repo),
        _repo.CurrentUser,
        new QueryCache(
          NullLogger<QueryCache>.Instance,
          new MemoryCache(new MemoryCacheOptions()),
          _repo.CurrentUser
        )
      ),
      fakeCurrentUserService
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
      .Count(e => ((IJournal)e.Entity).Name == "Yes")
      .Should()
      .Be(1);

    result.Entities.Count(e => e.EntityType == EntityType.Entry).Should().Be(1);

    result.Journals.Length.Should().Be(1);
    result.Journals[0].Name.Should().Be("No");
  }

  [Test]
  public async Task FindEntriesOfJournalType()
  {
    var addJournalExecutor = new AddJournalCommandExecutor(_repo, _dateService);
    CommandResult commandResult = await addJournalExecutor.Execute(
      new AddJournalCommand
      {
        Name = "Scrap Journal",
        Type = JournalType.Scraps
      }
    );

    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_repo, _repo, _dateService);
    await addEntryExecutor.Execute(
      new UpsertScrapsEntryCommand
      {
        JournalId = commandResult.EntityId,
        DateTime = _dateService.UtcNow,
        Notes = "Random text"
      }
    );

    SearchEntitiesResult result1 = await _searchExecutor.Execute(
      new SearchEntitiesQuery
      {
        SearchText = "Random",
        OnlyEntriesOfTypes = [JournalType.Scraps]
      }
    );

    result1.Entities.Length.Should().Be(1);

    SearchEntitiesResult result2 = await _searchExecutor.Execute(
      new SearchEntitiesQuery
      {
        SearchText = "Random",
        OnlyEntriesOfTypes = [JournalType.Gauge]
      }
    );

    result2.Entities.Length.Should().Be(0);
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

    result.Journals.Length.Should().Be(1);
    result.Entities.Length.Should().Be(2);
  }

  private async Task AddEntitiesWithSchedule()
  {
    var addJournalExecutor = new AddJournalCommandExecutor(_repo, _dateService);
    CommandResult commandResult = await addJournalExecutor.Execute(
      new AddJournalCommand
      {
        Name = "Journal with Schedule",
        Type = JournalType.Scraps
      }
    );

    var addScheduleExecutor = new AddScheduleToJournalCommandExecutor(_repo, _repo.CurrentUser);
    await addScheduleExecutor.Execute(
      new AddScheduleToJournalCommand
      {
        JournalId = commandResult.EntityId,
        NextOccurrence = _dateService.UtcNow.AddDays(10)
      }
    );

    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_repo, _repo, _dateService);
    CommandResult entryResult = await addEntryExecutor.Execute(
      new UpsertScrapsEntryCommand
      {
        JournalId = commandResult.EntityId,
        DateTime = _dateService.UtcNow,
        Notes = "Entry with Schedule"
      }
    );

    // the entry itself is scheduled, so it shows up in a "scheduled only" search.
    var addEntryScheduleExecutor = new AddScheduleToEntryCommandExecutor(_repo, _repo, _repo.CurrentUser);
    await addEntryScheduleExecutor.Execute(
      new AddScheduleToEntryCommand
      {
        EntryId = entryResult.EntityId,
        NextOccurrence = _dateService.UtcNow.AddDays(10)
      }
    );
  }

  private async Task AddJournalToIgnoreWithOneEntryToFind()
  {
    var addJournalExecutor = new AddJournalCommandExecutor(_repo, _dateService);
    CommandResult commandResult = await addJournalExecutor.Execute(
      new AddJournalCommand
      {
        Name = "No",
        Type = JournalType.Scraps
      }
    );

    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_repo, _repo, _dateService);
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
    var addJournalExecutor = new AddJournalCommandExecutor(_repo, _dateService);
    CommandResult commandResult = await addJournalExecutor.Execute(
      new AddJournalCommand
      {
        Name = "Yes",
        Type = JournalType.Scraps
      }
    );

    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_repo, _repo, _dateService);
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
