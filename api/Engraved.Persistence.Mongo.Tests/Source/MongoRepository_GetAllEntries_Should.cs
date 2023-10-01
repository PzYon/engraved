using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_GetAllEntries_Should
{
  private MongoRepository _repository = null!;
  private string _journalId = null!;
  private readonly string _userId = MongoUtil.GenerateNewIdAsString();

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
    IEntry[] entries = await _repository.GetAllEntries(_journalId, null, null, null);

    Assert.AreEqual(0, entries.Length);
  }

  [Test]
  public async Task Consider_ToDate()
  {
    string entryId = await AddEntry(DateTime.Now.AddDays(-3));
    await AddEntry(DateTime.Now.AddDays(3));

    IEntry[] entries = await _repository.GetAllEntries(_journalId, null, DateTime.Now, null);

    Assert.AreEqual(1, entries.Length);
    Assert.AreEqual(entryId, entries.First().Id);
  }

  [Test]
  public async Task Consider_FromDate()
  {
    await AddEntry(DateTime.Now.AddDays(-1));
    string entryId = await AddEntry(DateTime.Now.AddDays(1));

    IEntry[] entries = await _repository.GetAllEntries(_journalId, DateTime.Now, null, null);

    Assert.AreEqual(1, entries.Length);
    Assert.AreEqual(entryId, entries.First().Id);
  }

  [Test]
  public async Task Consider_FromAndToDate_Negative()
  {
    await AddEntry(DateTime.Now.AddDays(-10));
    await AddEntry(DateTime.Now.AddDays(10));

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      DateTime.Now.AddDays(-1),
      DateTime.Now.AddDays(1),
      null
    );

    Assert.AreEqual(0, entries.Length);
  }

  [Test]
  public async Task Consider_FromAndToDate_Positive()
  {
    await AddEntry(DateTime.Now.AddDays(-2));
    await AddEntry(DateTime.Now.AddDays(2));

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      DateTime.Now.AddDays(-5),
      DateTime.Now.AddDays(5),
      null
    );

    Assert.AreEqual(2, entries.Length);
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

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      new DateTime(2000, 7, 1),
      new DateTime(2000, 7, 31),
      null
    );

    Assert.AreEqual(2, entries.Length);

    Assert.IsTrue(entries.Select(m => m.Id).Contains(expectedId1));
    Assert.IsTrue(entries.Select(m => m.Id).Contains(expectedId2));
  }

  [Test]
  public async Task Consider_Simple_AttributeValue_Positive()
  {
    var attributeValues = new Dictionary<string, string[]> { { "attr", new[] { "xyz" } } };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      null,
      null,
      attributeValues
    );

    Assert.AreEqual(1, entries.Length);
  }

  [Test]
  public async Task Consider_Simple_AttributeValue_Negative()
  {
    var attributeValues = new Dictionary<string, string[]> { { "attr", new[] { "xyz" } } };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]> { { "attr", new[] { "abc" } } }
    );

    Assert.AreEqual(0, entries.Length);
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_OnSource_Positive()
  {
    var attributeValues = new Dictionary<string, string[]>
    {
      { "color", new[] { "blue" } },
      { "size", new[] { "XL" } }
    };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]> { { "size", new[] { "XL" } } }
    );

    Assert.AreEqual(1, entries.Length);
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_InQuery_Negative()
  {
    var attributeValues = new Dictionary<string, string[]>
    {
      { "size", new[] { "XL" } }
    };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]>
      {
        { "size", new[] { "XL" } }, { "color", new[] { "blue" } }
      }
    );

    Assert.AreEqual(0, entries.Length);
  }

  [Test]
  public async Task Consider_Multiple_AttributeValues_Or()
  {
    var attributeValues = new Dictionary<string, string[]>
    {
      { "size", new[] { "XL" } }
    };

    await AddEntry(DateTime.Now, attributeValues);

    IEntry[] entries = await _repository.GetAllEntries(
      _journalId,
      null,
      null,
      new Dictionary<string, string[]> { { "size", new[] { "XL", "L" } } }
    );

    Assert.AreEqual(1, entries.Length);
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
