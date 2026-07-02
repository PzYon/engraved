using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using Engraved.TestUtils;
using FluentAssertions;
using MongoDB.Bson;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepositoryBase_SearchEntries_Should
{
  private string _journalId = null!;
  private UnrestrictedMongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    var journal = new GaugeJournal { Name = "Test" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    _journalId = result.EntityId;

    await _repository.UpsertEntry(
      new GaugeEntry
      {
        ParentId = result.EntityId,
        Value = 1,
        Notes = "Lorem ipsum dolor", EditedOn = DateTime.Now.AddDays(-10)
      }
    );
    await _repository.UpsertEntry(
      new GaugeEntry
      {
        ParentId = result.EntityId,
        Value = 2,
        Notes = "Alpha Beta Gamma",
        EditedOn = DateTime.Now.AddDays(-20)
      }
    );
    await _repository.UpsertEntry(
      new GaugeEntry
      {
        ParentId = result.EntityId,
        Value = 3,
        Notes = "Heiri Herbert Hans",
        EditedOn = DateTime.Now.AddDays(-30)
      }
    );
  }

  [Test]
  public async Task FindEntries()
  {
    IEntry[] results = await _repository.SearchEntries("Beta", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_IgnoringCase()
  {
    IEntry[] results = await _repository.SearchEntries("beta", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_MultipleWords()
  {
    IEntry[] results = await _repository.SearchEntries("beta gam", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_NonConsecutiveWords()
  {
    IEntry[] results = await _repository.SearchEntries("alpha gam", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task TreatRegexMetacharactersLiterally()
  {
    await _repository.UpsertEntry(
      new GaugeEntry
      {
        ParentId = _journalId,
        Value = 4,
        Notes = "price (USD)",
        EditedOn = DateTime.Now.AddDays(-5)
      }
    );

    // "(USD)" is a valid regex (a group); when matched literally it must only
    // find the entry that actually contains the parentheses.
    IEntry[] results = await _repository.SearchEntries("(USD)", null, null, [_journalId], 10);

    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(4);
  }

  [Test]
  public void DoesNotThrowOnMalformedRegexInput()
  {
    // An unbalanced bracket is an invalid regex. Before escaping, this threw
    // while building the filter (and surfaced as a 500).
    Assert.DoesNotThrowAsync(
      async () => await _repository.SearchEntries("(unclosed", null, null, [_journalId], 10)
    );
  }

  [Test]
  public async Task Consider_ScrapsTitle()
  {
    var journal = new ScrapsJournal { Name = "My Scrap" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    await _repository.UpsertEntry(
      new ScrapsEntry { ParentId = result.EntityId, ScrapType = ScrapType.List, Title = "Heiri" }
    );
    await _repository.UpsertEntry(
      new ScrapsEntry { ParentId = result.EntityId, ScrapType = ScrapType.List, Title = "Franz" }
    );

    IEntry[] results = await _repository.SearchEntries("heiri", null, null, [result.EntityId], 10);

    results.Length.Should().Be(1);
    ((ScrapsEntry)results[0]).Title.Should().Be("Heiri");
  }

  [Test]
  public async Task Consider_JournalTypes_Negative()
  {
    IEntry[] results = await _repository.SearchEntries(
      null,
      null,
      [JournalType.Counter],
      null,
      10
    );

    results.Should().BeEmpty();
  }

  [Test]
  public async Task Consider_JournalTypes_Positive()
  {
    var journal = new ScrapsJournal { Name = "My Scrap" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    await _repository.UpsertEntry(
      new ScrapsEntry { ParentId = result.EntityId, ScrapType = ScrapType.List, Title = "Heiri" }
    );

    IEntry[] results = await _repository.SearchEntries(
      null,
      null,
      [JournalType.Scraps],
      null,
      10
    );

    results.Length.Should().Be(1);
    results[0].Should().BeOfType<ScrapsEntry>();
  }

  [Test]
  public async Task Consider_JournalTypes_LogBook()
  {
    var journal = new LogBookJournal { Name = "My LogBook" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    await _repository.UpsertEntry(
      new LogBookEntry { ParentId = result.EntityId, Notes = "log book entry" }
    );

    IEntry[] results = await _repository.SearchEntries(
      null,
      null,
      [JournalType.LogBook],
      null,
      10
    );

    results.Length.Should().Be(1);
    results[0].Should().BeOfType<LogBookEntry>();
  }

  [Test]
  public async Task Sort_Scheduled_Before_EditedOn()
  {
    var currentUserId = ObjectId.GenerateNewId().ToString();

    UpsertResult result = await _repository.UpsertJournal(
      new ScrapsJournal
      {
        Name = "My Scrap",
        UserId = currentUserId
      }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = result.EntityId,
        ScrapType = ScrapType.List,
        Title = "WithSchedule",
        EditedOn = DateTime.Now.AddDays(-2),
        Schedules = { { currentUserId, new Schedule { NextOccurrence = DateTime.Now.AddDays(-222) } } }
      }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = result.EntityId,
        ScrapType = ScrapType.List,
        Title = "WithOtherUserSchedule",
        EditedOn = DateTime.Now.AddDays(-2),
        Schedules =
        {
          { ObjectId.GenerateNewId().ToString(), new Schedule { NextOccurrence = DateTime.Now.AddDays(-222) } }
        }
      }
    );

    // edited on "now" is newer than "now-2days", but due to
    // schedule, "now-2days" should be sorted first.

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = result.EntityId,
        ScrapType = ScrapType.List,
        Title = "WithoutSchedule",
        UserId = currentUserId,
        EditedOn = DateTime.Now.AddDays(-1000),
      }
    );

    IEntry[] results = await _repository.SearchEntries(
      null,
      ScheduleMode.CurrentUserFirst,
      null,
      null,
      20,
      currentUserId
    );

    results.Length.Should().Be(6);
    ((ScrapsEntry)results[0]).Title.Should().Be("WithSchedule");
    ((ScrapsEntry)results[1]).Title.Should().Be("WithOtherUserSchedule");
    ((ScrapsEntry)results[5]).Title.Should().Be("WithoutSchedule");
  }

  [Test]
  public async Task ScheduleModeNone_SortsPurelyByEditedOn_WithoutFloatingScheduled()
  {
    // The "entries" tab uses ScheduleMode.None and must be sorted purely by edited date descending.
    // A scheduled entry that was edited long ago must NOT be floated to the top.
    var currentUserId = ObjectId.GenerateNewId().ToString();

    UpsertResult journal = await _repository.UpsertJournal(
      new ScrapsJournal { Name = "Tab", UserId = currentUserId }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = journal.EntityId,
        ScrapType = ScrapType.List,
        Title = "OldButScheduled",
        EditedOn = DateTime.Now.AddDays(-100),
        Schedules = { { currentUserId, new Schedule { NextOccurrence = DateTime.Now.AddDays(1) } } }
      }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = journal.EntityId,
        ScrapType = ScrapType.List,
        Title = "RecentUnscheduled",
        EditedOn = DateTime.Now.AddDays(-1)
      }
    );

    IEntry[] results = await _repository.SearchEntries(
      null,
      ScheduleMode.None,
      null,
      [journal.EntityId],
      20,
      currentUserId
    );

    results.Length.Should().Be(2);
    ((ScrapsEntry)results[0]).Title.Should().Be("RecentUnscheduled");
    ((ScrapsEntry)results[1]).Title.Should().Be("OldButScheduled");
  }

  [Test]
  public async Task ScheduleModeCurrentUserOnly_ExcludesEntriesWhoseScheduleHasNoPendingOccurrence()
  {
    // The "scheduled" tab uses ScheduleMode.CurrentUserOnly. A schedule sub-document is kept after it
    // has fired (NextOccurrence nulled out), so such an entry must NOT be returned as "scheduled".
    var currentUserId = ObjectId.GenerateNewId().ToString();

    UpsertResult journal = await _repository.UpsertJournal(
      new ScrapsJournal { Name = "Tab", UserId = currentUserId }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = journal.EntityId,
        ScrapType = ScrapType.List,
        Title = "Pending",
        Schedules = { { currentUserId, new Schedule { NextOccurrence = DateTime.Now.AddDays(1) } } }
      }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = journal.EntityId,
        ScrapType = ScrapType.List,
        Title = "AlreadyFired",
        Schedules = { { currentUserId, new Schedule { NextOccurrence = null } } }
      }
    );

    IEntry[] results = await _repository.SearchEntries(
      null,
      ScheduleMode.CurrentUserOnly,
      null,
      [journal.EntityId],
      20,
      currentUserId
    );

    results.Length.Should().Be(1);
    ((ScrapsEntry)results[0]).Title.Should().Be("Pending");
  }
}
