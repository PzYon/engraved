using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
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
    await new UpsertCounterEntryCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Entries.Count);
    Assert.AreEqual("foo", _testRepository.Entries.First().Notes);
  }

  [Test]
  public async Task UpdateExisting()
  {
    IDateService dateService = new FakeDateService();

    _testRepository.Journals.Add(new GaugeJournal { Id = "journal_id" });

    var createCommand = new UpsertGaugeEntryCommand { JournalId = "journal_id", Notes = "foo", Value = 123 };

    var commandExecutor = new UpsertGaugeEntryCommandExecutor(createCommand);
    CommandResult result = await commandExecutor.Execute(_testRepository, dateService);

    var updateCommand = new UpsertGaugeEntryCommand
    {
      Id = result.EntityId,
      JournalId = "journal_id",
      Notes = "bar",
      Value = 42
    };

    commandExecutor = new UpsertGaugeEntryCommandExecutor(updateCommand);
    await commandExecutor.Execute(_testRepository, dateService);

    Assert.AreEqual(1, _testRepository.Entries.Count);
    Assert.AreEqual("bar", _testRepository.Entries.First().Notes);
    Assert.AreEqual(dateService.UtcNow, _testRepository.Entries.First().EditedOn);
    Assert.AreEqual(42, _testRepository.Entries.OfType<GaugeEntry>().First().Value);
  }

  [Test]
  public void Throw_WhenJournalIdIsNotSpecified()
  {
    var command = new UpsertCounterEntryCommand { JournalId = string.Empty };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertCounterEntryCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }

  [Test]
  public void Throw_WhenJournalDoesNotExist()
  {
    var command = new UpsertCounterEntryCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s"
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertCounterEntryCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }
}
