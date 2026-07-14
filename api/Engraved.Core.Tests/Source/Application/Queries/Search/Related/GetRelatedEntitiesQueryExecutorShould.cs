using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Application.Queries.Search.Related;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils.Source;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Queries.Search.Related;

public class GetRelatedEntitiesQueryExecutorShould
{
  private FakeDateService _dateService = null!;
  private GetRelatedEntitiesQueryExecutor _executor = null!;
  private TestUserRestrictedMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    const string userId = TestIds.UserId;
    _repo = await Util.CreateUserRestrictedMongoRepository(userId, userId, false);

    await _repo.UpsertUser(new User { Id = userId, Name = userId });

    _dateService = new FakeDateService();
    _executor = new GetRelatedEntitiesQueryExecutor(_repo, _repo);
  }

  [Test]
  public async Task FindRelatedItemsForEntry_ExcludingItsOwnJournal()
  {
    // the parent journal shares a word ("Pasta") with the source entry, but neither
    // it nor its entries may show up - they are already visible on the current page.
    var ownJournalId = await AddJournal("Pasta Cooking");
    var sourceEntryId = await AddScrap(ownJournalId, "Pasta Carbonara Recipe");
    await AddScrap(ownJournalId, "Pasta Bolognese Recipe");

    var otherJournalId = await AddJournal("Restaurants");
    await AddScrap(otherJournalId, "Best Carbonara in Town");

    await AddJournal("Pasta Places");

    SearchEntitiesResult result = await _executor.Execute(
      new GetRelatedEntitiesQuery { EntityType = EntityType.Entry, EntityId = sourceEntryId }
    );

    result.Entities.Length.Should().Be(2);

    result.Entities
      .Where(e => e.EntityType == EntityType.Entry)
      .Select(e => ((ScrapsEntry)e.Entity).Title)
      .Should()
      .BeEquivalentTo("Best Carbonara in Town");

    result.Entities
      .Where(e => e.EntityType == EntityType.Journal)
      .Select(e => ((IJournal)e.Entity).Name)
      .Should()
      .BeEquivalentTo("Pasta Places");

    // parent journals of matched entries are returned so the client can render them together
    result.Journals.Select(j => j.Name).Should().BeEquivalentTo("Restaurants");
  }

  [Test]
  public async Task FindRelatedItemsForJournal_ExcludingItselfAndItsEntries()
  {
    var sourceJournalId = await AddJournal("Pasta Recipes");
    await AddScrap(sourceJournalId, "Pasta Carbonara");

    await AddJournal("Recipes Collection");

    var otherJournalId = await AddJournal("Notes");
    await AddScrap(otherJournalId, "Pasta Shapes");

    SearchEntitiesResult result = await _executor.Execute(
      new GetRelatedEntitiesQuery { EntityType = EntityType.Journal, EntityId = sourceJournalId }
    );

    result.Entities.Length.Should().Be(2);

    result.Entities
      .Where(e => e.EntityType == EntityType.Journal)
      .Select(e => ((IJournal)e.Entity).Name)
      .Should()
      .BeEquivalentTo("Recipes Collection");

    result.Entities
      .Where(e => e.EntityType == EntityType.Entry)
      .Select(e => ((ScrapsEntry)e.Entity).Title)
      .Should()
      .BeEquivalentTo("Pasta Shapes");
  }

  [Test]
  public async Task RankTitleMatchesAboveNotesMatches()
  {
    var sourceJournalId = await AddJournal("Stuff");
    var sourceEntryId = await AddScrap(sourceJournalId, "Tokyo Journey");

    var otherJournalId = await AddJournal("Other");
    await AddScrap(otherJournalId, "Random Thoughts", "remember the tokyo trip");
    await AddScrap(otherJournalId, "Tokyo Itinerary");

    SearchEntitiesResult result = await _executor.Execute(
      new GetRelatedEntitiesQuery { EntityType = EntityType.Entry, EntityId = sourceEntryId }
    );

    result.Entities.Length.Should().Be(2);
    ((ScrapsEntry)result.Entities[0].Entity).Title.Should().Be("Tokyo Itinerary");
    ((ScrapsEntry)result.Entities[1].Entity).Title.Should().Be("Random Thoughts");
  }

  [Test]
  public async Task FindItemsMatchingViaUmlautWords()
  {
    // words with leading/trailing umlauts break \b-based patterns on mongo's
    // ASCII-only PCRE2 engine - pinned end-to-end here (see WholeWordRegex).
    var sourceJournalId = await AddJournal("Sport");
    var sourceEntryId = await AddScrap(sourceJournalId, "Übung Klettern");

    var otherJournalId = await AddJournal("Fitness");
    await AddScrap(otherJournalId, "Übung Yoga");

    SearchEntitiesResult result = await _executor.Execute(
      new GetRelatedEntitiesQuery { EntityType = EntityType.Entry, EntityId = sourceEntryId }
    );

    result.Entities.Length.Should().Be(1);
    ((ScrapsEntry)result.Entities[0].Entity).Title.Should().Be("Übung Yoga");
  }

  [Test]
  public async Task ReturnNothing_WhenTitleConsistsOfStopWordsOnly()
  {
    var sourceJournalId = await AddJournal("Stuff");
    var sourceEntryId = await AddScrap(sourceJournalId, "the and for");

    var otherJournalId = await AddJournal("Other");
    await AddScrap(otherJournalId, "the best list");

    SearchEntitiesResult result = await _executor.Execute(
      new GetRelatedEntitiesQuery { EntityType = EntityType.Entry, EntityId = sourceEntryId }
    );

    result.Entities.Should().BeEmpty();
  }

  [Test]
  public async Task NotReturnEntriesWithoutOwnRoute()
  {
    var sourceJournalId = await AddJournal("Plans");
    var sourceEntryId = await AddScrap(sourceJournalId, "Marathon Training Plan");

    // a gauge entry has no page of its own, so it is no navigation target -
    // it must not be returned even though its notes match.
    var gaugeJournalId = await AddJournal("Numbers", JournalType.Gauge);
    var addGaugeExecutor = new UpsertGaugeEntryCommandExecutor(_repo, _repo, _dateService);
    await addGaugeExecutor.Execute(
      new UpsertGaugeEntryCommand
      {
        JournalId = gaugeJournalId,
        Value = 42,
        Notes = "marathon training today",
        DateTime = _dateService.UtcNow
      }
    );

    var otherJournalId = await AddJournal("Food");
    await AddScrap(otherJournalId, "Marathon Nutrition");

    SearchEntitiesResult result = await _executor.Execute(
      new GetRelatedEntitiesQuery { EntityType = EntityType.Entry, EntityId = sourceEntryId }
    );

    result.Entities.Length.Should().Be(1);
    ((ScrapsEntry)result.Entities[0].Entity).Title.Should().Be("Marathon Nutrition");
  }

  [Test]
  public async Task ReturnNothing_WhenSourceDoesNotExist()
  {
    SearchEntitiesResult result = await _executor.Execute(
      new GetRelatedEntitiesQuery { EntityType = EntityType.Entry, EntityId = "507f1f77bcf86cd799439011" }
    );

    result.Entities.Should().BeEmpty();
    result.Journals.Should().BeEmpty();
  }

  [Test]
  public void Throw_WhenEntityIdIsMissing()
  {
    Assert.ThrowsAsync<InvalidQueryException>(async ()
      => await _executor.Execute(new GetRelatedEntitiesQuery { EntityType = EntityType.Entry })
    );
  }

  private async Task<string> AddJournal(string name, JournalType type = JournalType.Scraps)
  {
    var addJournalExecutor = new AddJournalCommandExecutor(_repo, _dateService);
    CommandResult result = await addJournalExecutor.Execute(new AddJournalCommand { Name = name, Type = type });
    return result.EntityId;
  }

  private async Task<string> AddScrap(string journalId, string title, string? notes = null)
  {
    var addEntryExecutor = new UpsertScrapsEntryCommandExecutor(_repo, _repo, _dateService);
    CommandResult result = await addEntryExecutor.Execute(
      new UpsertScrapsEntryCommand
      {
        JournalId = journalId,
        Title = title,
        Notes = notes,
        DateTime = _dateService.UtcNow
      }
    );

    return result.EntityId;
  }
}
