using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_GetLastEditedEntries_Should
{
  private string _journalId = null!;
  private MongoRepository _repository = null!;

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
    IEntry[] results = await _repository.GetLastEditedEntries("Beta", false, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_IgnoringCase()
  {
    IEntry[] results = await _repository.GetLastEditedEntries("beta", false, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_MultipleWords()
  {
    IEntry[] results = await _repository.GetLastEditedEntries("beta gam", false, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_NonConsecutiveWords()
  {
    IEntry[] results = await _repository.GetLastEditedEntries("alpha gam", false, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
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

    IEntry[] results = await _repository.GetLastEditedEntries("heiri", false, null, [result.EntityId], 10);

    results.Length.Should().Be(1);
    ((ScrapsEntry) results[0]).Title.Should().Be("Heiri");
  }

  [Test]
  public async Task Consider_JournalTypes_Negative()
  {
    IEntry[] results = await _repository.GetLastEditedEntries(
      null,
      false,
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

    IEntry[] results = await _repository.GetLastEditedEntries(
      null,
      false,
      [JournalType.Scraps],
      null,
      10
    );

    results.Length.Should().Be(1);
    results[0].Should().BeOfType<ScrapsEntry>();
  }
}
