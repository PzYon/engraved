using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Measurements.Upsert.Counter;
using Engraved.Core.Application.Commands.Measurements.Upsert.Gauge;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Measurements.Upsert;

public class UpsertCounterMeasurementCommandExecutorShould
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
    _testRepository.Journals.Add(new CounterJournal { Id = "metric_id" });

    var command = new UpsertCounterMeasurementCommand { JournalId = "metric_id", Notes = "foo" };
    await new UpsertCounterMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);
    Assert.AreEqual("foo", _testRepository.Measurements.First().Notes);
  }

  [Test]
  public async Task UpdateExisting()
  {
    IDateService dateService = new FakeDateService();

    _testRepository.Journals.Add(new GaugeJournal { Id = "metric_id" });

    var createCommand = new UpsertGaugeMeasurementCommand { JournalId = "metric_id", Notes = "foo", Value = 123 };

    var commandExecutor = new UpsertGaugeMeasurementCommandExecutor(createCommand);
    CommandResult result = await commandExecutor.Execute(_testRepository, dateService);

    var updateCommand = new UpsertGaugeMeasurementCommand
    {
      Id = result.EntityId,
      JournalId = "metric_id",
      Notes = "bar",
      Value = 42
    };

    commandExecutor = new UpsertGaugeMeasurementCommandExecutor(updateCommand);
    await commandExecutor.Execute(_testRepository, dateService);

    Assert.AreEqual(1, _testRepository.Measurements.Count);
    Assert.AreEqual("bar", _testRepository.Measurements.First().Notes);
    Assert.AreEqual(dateService.UtcNow, _testRepository.Measurements.First().EditedOn);
    Assert.AreEqual(42, _testRepository.Measurements.OfType<GaugeMeasurement>().First().Value);
  }

  [Test]
  public void Throw_WhenMetricIdIsNotSpecified()
  {
    var command = new UpsertCounterMeasurementCommand { JournalId = string.Empty };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertCounterMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }

  [Test]
  public void Throw_WhenMetricDoesNotExist()
  {
    var command = new UpsertCounterMeasurementCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s"
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertCounterMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }
}
