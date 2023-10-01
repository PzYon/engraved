using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_GetLastEditedEntries_Should
{
  private MongoRepository _repository = null!;

  private string _journalId = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    var journal = new GaugeJournal { Name = "Test" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    _journalId = result.EntityId;

    await _repository.UpsertEntry(
      new GaugeEntry { ParentId = result.EntityId, Value = 1, Notes = "Lorem ipsum dolor" }
    );
    await _repository.UpsertEntry(
      new GaugeEntry { ParentId = result.EntityId, Value = 2, Notes = "Alpha Beta Gamma" }
    );
    await _repository.UpsertEntry(
      new GaugeEntry { ParentId = result.EntityId, Value = 3, Notes = "Heiri Herbert Hans" }
    );
  }

  [Test]
  public async Task FindEntries()
  {
    IEntry[] results = await _repository.GetLastEditedEntries(new[] { _journalId }, "Beta", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindEntries_IgnoringCase()
  {
    IEntry[] results = await _repository.GetLastEditedEntries(new[] { _journalId }, "beta", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindEntries_MultipleWords()
  {
    IEntry[] results = await _repository.GetLastEditedEntries(new[] { _journalId }, "beta gam", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
  }

  [Test]
  public async Task FindEntries_NonConsecutiveWords()
  {
    IEntry[] results = await _repository.GetLastEditedEntries(new[] { _journalId }, "alpha gam", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(2, results[0].GetValue());
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

    IEntry[] results = await _repository.GetLastEditedEntries(new[] { result.EntityId }, "heiri", null, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(((ScrapsEntry)results[0]).Title, "Heiri");
  }

  [Test]
  public async Task Consider_JournalTypes_Negative()
  {
    IEntry[] results = await _repository.GetLastEditedEntries(
      null,
      null,
      new[] { JournalType.Counter },
      10
    );

    Assert.AreEqual(0, results.Length);
  }

  [Test]
  public async Task Consider_JournalTypes_Positive()
  {
    var journal = new ScrapsJournal { Name = "My Scrap" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    await _repository.UpsertEntry(
      new ScrapsEntry { ParentId = result.EntityId, ScrapType = ScrapType.List, Title = "Heiri" }
    );

    IEntry[] results = await _repository.GetLastEditedEntries(
      null,
      null,
      new[] { JournalType.Scraps },
      10
    );

    Assert.AreEqual(1, results.Length);
    Assert.IsTrue(results[0] is ScrapsEntry);
  }
}
