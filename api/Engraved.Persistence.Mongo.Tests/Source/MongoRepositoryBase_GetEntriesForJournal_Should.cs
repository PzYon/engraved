using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepositoryBase_GetEntriesForJournal_Should
{
  private readonly string _userId = MongoUtil.GenerateNewIdAsString();
  private string _journalId = null!;
  private UnrestrictedMongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    UpsertResult upsertJournal = await _repository.UpsertJournal(new CounterJournal());
    _journalId = upsertJournal.EntityId;
  }

  [Test]
  public async Task Return_Empty()
  {
    IEntry[] entries = await _repository.GetEntriesForJournal(_journalId);

    entries.Should().BeEmpty();
  }

  [Test]
  public async Task Consider_ToDate()
  {
    string entryId = await AddEntry(DateTime.Now.AddDays(-3));
    await AddEntry(DateTime.Now.AddDays(3));

    IEntry[] entries = await _repository.GetEntriesForJournal(_journalId, null, DateTime.Now);

    entries.Length.Should().Be(1);
    entries.First().Id.Should().Be(entryId);
  }

  [Test]
  public async Task Consider_FromDate()
  {
    await AddEntry(DateTime.Now.AddDays(-1));
    string entryId = await AddEntry(DateTime.Now.AddDays(1));

    IEntry[] entries = await _repository.GetEntriesForJournal(_journalId, DateTime.Now);

    entries.Length.Should().Be(1);
    entries.First().Id.Should().Be(entryId);
  }

  [Test]
  public async Task Consider_FromAndToDate_Negative()
  {
    await AddEntry(DateTime.Now.AddDays(-10));
    await AddEntry(DateTime.Now.AddDays(10));

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      DateTime.Now.AddDays(-1),
      DateTime.Now.AddDays(1)
    );

    entries.Should().BeEmpty();
  }

  [Test]
  public async Task Consider_FromAndToDate_Positive()
  {
    await AddEntry(DateTime.Now.AddDays(-2));
    await AddEntry(DateTime.Now.AddDays(2));

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      DateTime.Now.AddDays(-5),
      DateTime.Now.AddDays(5)
    );

    entries.Length.Should().Be(2);
  }

  [Test]
  public async Task Consider_Dates_AtTheBeginningAndEndOfRange()
  {
    var lastInLastMonth = new DateTime(2000, 6, 30, 5, 30, 0);
    var firstInCurrentMonth = new DateTime(2000, 7, 1, 5, 30, 0);
    var lastInCurrentMonth = new DateTime(2000, 7, 31, 5, 30, 0);
    var firstInNextMonth = new DateTime(2000, 8, 1, 5, 30, 0);

    await AddEntry(lastInLastMonth);
    string expectedId1 = await AddEntry(firstInCurrentMonth);
    string expectedId2 = await AddEntry(lastInCurrentMonth);
    await AddEntry(firstInNextMonth);

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      new DateTime(2000, 7, 1),
      new DateTime(2000, 7, 31)
    );

    entries.Length.Should().Be(2);

    entries.Select(m => m.Id).Should().Contain(expectedId1);
    entries.Select(m => m.Id).Should().Contain(expectedId2);
  }

  [Test]
  public async Task Consider_Simple_AttributeValue_Positive()
  {
    var attributeValues = new Dictionary<string, string[]> { { "attr", ["xyz"] } };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      null,
      null,
      attributeValues
    );

    entries.Length.Should().Be(1);
  }

  [Test]
  public async Task Consider_Simple_AttributeValue_Negative()
  {
    var attributeValues = new Dictionary<string, string[]> { { "attr", ["xyz"] } };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]> { { "attr", ["abc"] } }
    );

    entries.Should().BeEmpty();
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_OnSource_Positive()
  {
    var attributeValues = new Dictionary<string, string[]>
    {
      { "color", ["blue"] },
      { "size", ["XL"] }
    };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]> { { "size", ["XL"] } }
    );

    entries.Length.Should().Be(1);
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_InQuery_Negative()
  {
    var attributeValues = new Dictionary<string, string[]> { { "size", ["XL"] } };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]> { { "size", ["XL"] }, { "color", ["blue"] } }
    );

    entries.Should().BeEmpty();
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_Or()
  {
    var attributeValues = new Dictionary<string, string[]> { { "size", ["XL"] } };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetEntriesForJournal(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]> { { "size", ["XL", "L"] } }
    );

    entries.Length.Should().Be(1);
  }

  [Test]
  public async Task Sort_By_DateTime_Descending_When_No_SortOrder_Is_Specified()
  {
    UpsertResult scrapsJournal = await _repository.UpsertJournal(new ScrapsJournal { Name = "My Scrap" });

    string olderButRecentlyEditedId = await AddScrap(
      scrapsJournal.EntityId,
      dateTime: DateTime.Now.AddDays(-10),
      editedOn: DateTime.Now
    );
    string newerButEditedLongAgoId = await AddScrap(
      scrapsJournal.EntityId,
      dateTime: DateTime.Now,
      editedOn: DateTime.Now.AddDays(-10)
    );

    IEntry[] entries = await _repository.GetEntriesForJournal(scrapsJournal.EntityId);

    entries.Length.Should().Be(2);
    entries[0].Id.Should().Be(newerButEditedLongAgoId);
    entries[1].Id.Should().Be(olderButRecentlyEditedId);
  }

  [Test]
  public async Task Sort_By_EditedOn_Descending_When_SortOrder_ByEditedOn_Is_Specified()
  {
    UpsertResult scrapsJournal = await _repository.UpsertJournal(new ScrapsJournal { Name = "My Scrap" });

    string olderButRecentlyEditedId = await AddScrap(
      scrapsJournal.EntityId,
      dateTime: DateTime.Now.AddDays(-10),
      editedOn: DateTime.Now
    );
    string newerButEditedLongAgoId = await AddScrap(
      scrapsJournal.EntityId,
      dateTime: DateTime.Now,
      editedOn: DateTime.Now.AddDays(-10)
    );

    IEntry[] entries = await _repository.GetEntriesForJournal(
      scrapsJournal.EntityId,
      sortOrder: SortEntriesBy.ByEditedOn
    );

    entries.Length.Should().Be(2);
    entries[0].Id.Should().Be(olderButRecentlyEditedId);
    entries[1].Id.Should().Be(newerButEditedLongAgoId);
  }

  private async Task<string> AddScrap(string journalId, DateTime dateTime, DateTime editedOn)
  {
    var entry = new ScrapsEntry
    {
      ParentId = journalId,
      ScrapType = ScrapType.Markdown,
      Title = "Scrap",
      DateTime = dateTime,
      EditedOn = editedOn
    };

    UpsertResult result = await _repository.UpsertEntry(entry);

    return result.EntityId;
  }

  private async Task<string> AddEntry(DateTime? date, Dictionary<string, string[]>? attributeValues = null)
  {
    var entry = new CounterEntry
    {
      ParentId = _journalId,
      UserId = _userId,
      DateTime = date,
      JournalAttributeValues = attributeValues ?? new Dictionary<string, string[]>()
    };

    UpsertResult result = await _repository.UpsertEntry(entry);

    return result.EntityId;
  }
}
