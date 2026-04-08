using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.LogBook;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public class UpsertLogBookEntryCommandExecutorShould
{
  private const string JournalId = "journal_id";
  private FakeDateService _fakeDateService = null!;

  private InMemoryRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new InMemoryRepository();
    _fakeDateService = new FakeDateService();

    _testRepository.Journals.Add(new LogBookJournal { Id = JournalId });
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
      await new UpsertLogBookEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    result.EntityId.Should().NotBeNull();
    _testRepository.Entries.Count.Should().Be(1);
    _testRepository.Entries.First().Notes.Should().Be("some notes");
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
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

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
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

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
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    func.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public void Throw_WhenEntryForSameDayAlreadyExists()
  {
    var existingDate = new DateTime(2026, 4, 9, 10, 0, 0, DateTimeKind.Utc);

    _testRepository.Entries.Add(
      new LogBookEntry
      {
        Id = Guid.NewGuid().ToString("N"),
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
      => await new UpsertLogBookEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    func.Should().ThrowAsync<InvalidCommandException>();
  }

  [Test]
  public async Task AllowUpdating_WhenEntryForSameDayAlreadyExistsWithSameId()
  {
    var existingDate = new DateTime(2026, 4, 9, 10, 0, 0, DateTimeKind.Utc);
    var entryId = Guid.NewGuid().ToString("N");

    _testRepository.Entries.Add(
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

    await new UpsertLogBookEntryCommandExecutor(_testRepository, _fakeDateService).Execute(command);

    _testRepository.Entries.Count.Should().Be(1);
    _testRepository.Entries.First().Notes.Should().Be("updated notes");
  }
}
