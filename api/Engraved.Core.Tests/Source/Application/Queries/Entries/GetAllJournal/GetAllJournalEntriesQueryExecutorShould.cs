using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Queries.Entries.GetAllJournal;

public class GetAllJournalEntriesQueryExecutorShould
{
  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task Sort_ScrapsJournal_By_EditedOn_Descending()
  {
    UpsertResult scrapsJournal = await _repo.UpsertJournal(new ScrapsJournal { Name = "My Scrap" });

    var olderButRecentlyEditedId = await AddScrap(
      scrapsJournal.EntityId,
      DateTime.Now.AddDays(-10),
      DateTime.Now
    );
    var newerButEditedLongAgoId = await AddScrap(
      scrapsJournal.EntityId,
      DateTime.Now,
      DateTime.Now.AddDays(-10)
    );

    var entries = await new GetAllJournalEntriesQueryExecutor(_repo, _repo).Execute(
      new GetAllJournalEntriesQuery { JournalId = scrapsJournal.EntityId }
    );

    entries.Length.Should().Be(2);
    entries[0].Id.Should().Be(olderButRecentlyEditedId);
    entries[1].Id.Should().Be(newerButEditedLongAgoId);
  }

  [Test]
  public async Task Sort_NonScrapsJournal_By_DateTime_Descending()
  {
    UpsertResult counterJournal = await _repo.UpsertJournal(new CounterJournal { Name = "My Counter" });

    var olderButRecentlyEditedId = await AddCounterEntry(
      counterJournal.EntityId,
      DateTime.Now.AddDays(-10),
      DateTime.Now
    );
    var newerButEditedLongAgoId = await AddCounterEntry(
      counterJournal.EntityId,
      DateTime.Now,
      DateTime.Now.AddDays(-10)
    );

    var entries = await new GetAllJournalEntriesQueryExecutor(_repo, _repo).Execute(
      new GetAllJournalEntriesQuery { JournalId = counterJournal.EntityId }
    );

    entries.Length.Should().Be(2);
    entries[0].Id.Should().Be(newerButEditedLongAgoId);
    entries[1].Id.Should().Be(olderButRecentlyEditedId);
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

    UpsertResult result = await _repo.UpsertEntry(entry);

    return result.EntityId;
  }

  private async Task<string> AddCounterEntry(string journalId, DateTime dateTime, DateTime editedOn)
  {
    var entry = new CounterEntry
    {
      ParentId = journalId,
      DateTime = dateTime,
      EditedOn = editedOn
    };

    UpsertResult result = await _repo.UpsertEntry(entry);

    return result.EntityId;
  }
}
