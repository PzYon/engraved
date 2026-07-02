using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.LogBook;
using Engraved.TestUtils;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public class UpsertLogBookEntryCommandExecutorShould
{
  private const string JournalId = "60703c3b0000000000000000";
  private FakeDateService _fakeDateService = null!;

  private TestMongoRepository _testRepository = null!;

  [SetUp]
  public async Task SetUp()
  {
    _testRepository = await Util.CreateMongoRepository();
    _fakeDateService = new FakeDateService();

    await _testRepository.UpsertJournal(new LogBookJournal { Id = JournalId });
  }

  [Test]
  public async Task CreateNew()
  {
    var command = new UpsertLogBookEntryCommand
    {
      JournalId = JournalId,
      Notes = "some notes",
      DateTime = _fakeDateService.UtcNow
    };

    CommandResult result =
      await new UpsertLogBookEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    (await _testRepository.CountAllEntries()).Should().Be(1);
    (await _testRepository.GetEntriesForJournal(JournalId)).First().Notes.Should().Be("some notes");
  }

  [Test]
  public void Throw_WhenNotesIsNull()
  {
    var command = new UpsertLogBookEntryCommand
    {
      JournalId = JournalId,
      Notes = null,
      DateTime = _fakeDateService.UtcNow
    };

    Func<Task> func = async ()
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    func.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public void Throw_WhenNotesIsWhitespace()
  {
    var command = new UpsertLogBookEntryCommand
    {
      JournalId = JournalId,
      Notes = "   ",
      DateTime = _fakeDateService.UtcNow
    };

    Func<Task> func = async ()
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    func.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public void Throw_WhenDateTimeIsNull()
  {
    var command = new UpsertLogBookEntryCommand
    {
      JournalId = JournalId,
      Notes = "some notes",
      DateTime = null
    };

    Func<Task> func = async ()
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    func.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public async Task StoreDateOnly_StrippingTimeComponent()
  {
    var command = new UpsertLogBookEntryCommand
    {
      JournalId = JournalId,
      Notes = "some notes",
      DateTime = new DateTime(2026, 4, 9, 13, 37, 42, DateTimeKind.Utc)
    };

    await new UpsertLogBookEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    IEntry entry = (await _testRepository.GetEntriesForJournal(JournalId)).Single();
    entry.DateTime.Should().Be(new DateTime(2026, 4, 9, 0, 0, 0, DateTimeKind.Utc));
    entry.DateTime!.Value.TimeOfDay.Should().Be(TimeSpan.Zero);
    entry.DateTime!.Value.Kind.Should().Be(DateTimeKind.Utc);
  }

  [Test]
  public async Task Throw_WhenEntryForSameDayAlreadyExists()
  {
    var existingDate = new DateTime(2026, 4, 9, 10, 0, 0, DateTimeKind.Utc);

    await _testRepository.UpsertEntry(
      new LogBookEntry
      {
        Id = "60703c3b0000000000000001",
        ParentId = JournalId,
        Notes = "existing notes",
        DateTime = existingDate
      }
    );

    var command = new UpsertLogBookEntryCommand
    {
      JournalId = JournalId,
      Notes = "new notes",
      DateTime = existingDate.AddHours(2)
    };

    var func = async ()
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    await func.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public async Task AllowUpdating_WhenEntryForSameDayAlreadyExistsWithSameId()
  {
    var existingDate = new DateTime(2026, 4, 9, 10, 0, 0, DateTimeKind.Utc);
    var entryId = "60703c3b0000000000000002";

    await _testRepository.UpsertEntry(
      new LogBookEntry
      {
        Id = entryId,
        ParentId = JournalId,
        Notes = "original notes",
        DateTime = existingDate
      }
    );

    var command = new UpsertLogBookEntryCommand
    {
      Id = entryId,
      JournalId = JournalId,
      Notes = "updated notes",
      DateTime = existingDate
    };

    await new UpsertLogBookEntryCommandExecutor(_testRepository, _testRepository, _fakeDateService).Execute(command);

    (await _testRepository.CountAllEntries()).Should().Be(1);
    (await _testRepository.GetEntriesForJournal(JournalId)).First().Notes.Should().Be("updated notes");
  }
}
