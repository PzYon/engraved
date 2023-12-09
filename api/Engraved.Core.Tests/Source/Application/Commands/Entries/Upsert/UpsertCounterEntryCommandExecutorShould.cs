using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public class UpsertCounterEntryCommandExecutorShould
{
  private InMemoryRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new InMemoryRepository();
  }

  [Test]
  public async Task CreateNew()
  {
    _testRepository.Journals.Add(new CounterJournal { Id = "journal_id" });

    var command = new UpsertCounterEntryCommand { JournalId = "journal_id", Notes = "foo" };
    await new UpsertCounterEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);

    _testRepository.Entries.Count.Should().Be(1);
    _testRepository.Entries.First().Notes.Should().Be("foo");
  }

  [Test]
  public async Task UpdateExisting()
  {
    IDateService dateService = new FakeDateService();

    _testRepository.Journals.Add(new GaugeJournal { Id = "journal_id" });

    var createCommand = new UpsertGaugeEntryCommand { JournalId = "journal_id", Notes = "foo", Value = 123 };

    var commandExecutor = new UpsertGaugeEntryCommandExecutor(_testRepository, dateService);
    CommandResult result = await commandExecutor.Execute(createCommand);

    var updateCommand = new UpsertGaugeEntryCommand
    {
      Id = result.EntityId,
      JournalId = "journal_id",
      Notes = "bar",
      Value = 42
    };

    commandExecutor = new UpsertGaugeEntryCommandExecutor(_testRepository, dateService);
    await commandExecutor.Execute(updateCommand);

    _testRepository.Entries.Count.Should().Be(1);
    _testRepository.Entries.First().Notes.Should().Be("bar");
    _testRepository.Entries.First().EditedOn.Should().Be(dateService.UtcNow);
    _testRepository.Entries.OfType<GaugeEntry>().First().Value.Should().Be(42);
  }

  [Test]
  public void Throw_WhenJournalIdIsNotSpecified()
  {
    var command = new UpsertCounterEntryCommand { JournalId = string.Empty };

    async void Action()
    {
      await new UpsertCounterEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);
    }

    Action action = Action;
    action.Should().Throw<InvalidCommandException>();
  }

  [Test]
  public void Throw_WhenJournalDoesNotExist()
  {
    var command = new UpsertCounterEntryCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s"
    };

    Action action = Action;
    action.Should().Throw<InvalidCommandException>();

    async void Action()
    {
      await new UpsertCounterEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);
    }
  }
}
