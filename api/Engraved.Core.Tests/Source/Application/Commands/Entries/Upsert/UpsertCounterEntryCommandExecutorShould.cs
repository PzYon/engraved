using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.TestUtils;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public class UpsertCounterEntryCommandExecutorShould
{
  private TestMongoRepository _testRepository = null!;

  [SetUp]
  public async Task SetUp()
  {
    _testRepository = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task CreateNew()
  {
    const string journalId = "60703c3b000000000000000a";
    await _testRepository.UpsertJournal(new CounterJournal { Id = journalId });

    var command = new UpsertCounterEntryCommand { JournalId = journalId, Notes = "foo" };
    await new UpsertCounterEntryCommandExecutor(_testRepository, _testRepository,new FakeDateService()).Execute(command);

    (await _testRepository.CountAllEntries()).Should().Be(1);
    (await _testRepository.GetEntriesForJournal(journalId)).First().Notes.Should().Be("foo");
  }

  [Test]
  public async Task UpdateExisting()
  {
    const string journalId = "60703c3b000000000000000b";
    IDateService dateService = new FakeDateService();

    await _testRepository.UpsertJournal(new GaugeJournal { Id = journalId });

    var createCommand = new UpsertGaugeEntryCommand { JournalId = journalId, Notes = "foo", Value = 123 };

    var commandExecutor = new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository,dateService);
    CommandResult result = await commandExecutor.Execute(createCommand);

    var updateCommand = new UpsertGaugeEntryCommand
    {
      Id = result.EntityId,
      JournalId = journalId,
      Notes = "bar",
      Value = 42
    };

    commandExecutor = new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository,dateService);
    await commandExecutor.Execute(updateCommand);

    (await _testRepository.CountAllEntries()).Should().Be(1);
    var entries = await _testRepository.GetEntriesForJournal(journalId);
    entries.First().Notes.Should().Be("bar");
    entries.First().EditedOn.Should().BeCloseTo(dateService.UtcNow, TimeSpan.FromMilliseconds(100));
    entries.OfType<GaugeEntry>().First().Value.Should().Be(42);
  }

  [Test]
  public void Throw_WhenJournalIdIsNotSpecified()
  {
    var command = new UpsertCounterEntryCommand { JournalId = string.Empty };

    Func<Task> func = Action;
    func.Should().ThrowAsync<InvalidCommandException>();

    async Task Action()
    {
      await new UpsertCounterEntryCommandExecutor(_testRepository, _testRepository,new FakeDateService()).Execute(command);
    }
  }

  [Test]
  public void Throw_WhenJournalDoesNotExist()
  {
    var command = new UpsertCounterEntryCommand
    {
      JournalId = "60703c3b000000000000000c",
      Notes = "n0t3s"
    };

    Func<Task> func = Action;
    func.Should().ThrowAsync<InvalidCommandException>();

    async Task Action()
    {
      await new UpsertCounterEntryCommandExecutor(_testRepository, _testRepository,new FakeDateService()).Execute(command);
    }
  }
}
