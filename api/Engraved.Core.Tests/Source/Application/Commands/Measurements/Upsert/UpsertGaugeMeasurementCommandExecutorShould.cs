using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Measurements.Upsert.Gauge;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Measurements.Upsert;

public class UpsertGaugeMeasurementCommandExecutorShould
{
  private InMemoryRepository _testRepository = null!;

  [SetUp]
  public void SetUp()
  {
    _testRepository = new InMemoryRepository();
  }

  [Test]
  [TestCase(0)]
  [TestCase(1)]
  [TestCase(123.456)]
  public async Task Set_ValueFromCommand(double value)
  {
    _testRepository.Journals.Add(new GaugeJournal { Id = "k3y" });

    var command = new UpsertGaugeMeasurementCommand
    {
      JournalId = "k3y",
      Value = value
    };

    CommandResult commandResult = await new UpsertGaugeMeasurementCommandExecutor(command).Execute(
      _testRepository,
      new FakeDateService()
    );

    Assert.IsFalse(string.IsNullOrEmpty(commandResult.EntityId));

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.JournalId, createdMeasurement.ParentId);

    var counterMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(counterMeasurement);
    Assert.AreEqual(value, counterMeasurement!.Value);
  }

  [Test]
  public void Throw_WhenNoValueIsSpecified()
  {
    _testRepository.Journals.Add(new GaugeJournal { Id = "k3y" });

    var command = new UpsertGaugeMeasurementCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s",
      Value = null
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }

  [Test]
  public async Task MapAllFieldsCorrectly()
  {
    _testRepository.Journals.Add(
      new GaugeJournal
      {
        Id = "k3y",
        Attributes =
        {
          {
            "stuff",
            new JournalAttribute
            {
              Name = "Stuff",
              Values = { { "x", "y" }, { "k3y", "v@lue" } }
            }
          }
        }
      }
    );

    const double value = 123.45;

    var command = new UpsertGaugeMeasurementCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s",
      Value = value,
      MetricAttributeValues = new Dictionary<string, string[]>
      {
        {
          "stuff", new[] { "k3y" }
        }
      }
    };

    await new UpsertGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());

    Assert.AreEqual(1, _testRepository.Measurements.Count);

    IMeasurement createdMeasurement = _testRepository.Measurements.First();
    Assert.AreEqual(command.JournalId, createdMeasurement.ParentId);
    Assert.AreEqual(command.Notes, createdMeasurement.Notes);

    AssertMetricAttributeValuesEqual(command.MetricAttributeValues, createdMeasurement.JournalAttributeValues);

    var gaugeMeasurement = createdMeasurement as GaugeMeasurement;
    Assert.IsNotNull(gaugeMeasurement);
    Assert.AreEqual(value, gaugeMeasurement!.Value);
  }

  private static void AssertMetricAttributeValuesEqual(Dictionary<string, string[]> d1, Dictionary<string, string[]> d2)
  {
    bool areEqual = d1 == d2
                    || (d1.Keys.Count == d2.Keys.Count
                        && d1.Keys.All(k => d2.ContainsKey(k) && AreEqual(d1[k], d2[k])));
    if (!areEqual)
    {
      Assert.Fail("MetricAttributeValues are not equal.");
    }
  }

  private static bool AreEqual(IEnumerable<string> first, IEnumerable<string> second)
  {
    CollectionAssert.AreEquivalent(first, second);
    return true;
  }

  // todo: Add test for value key
  [Test]
  public void Throw_WhenMetricAttributeKeyDoesNotExistOnMetric()
  {
    _testRepository.Journals.Add(new GaugeJournal { Id = "k3y" });

    var command = new UpsertGaugeMeasurementCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s",
      Value = 42,
      MetricAttributeValues = new Dictionary<string, string[]> { { "fooBar", new[] { "x" } } }
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertGaugeMeasurementCommandExecutor(command).Execute(_testRepository, new FakeDateService());
      }
    );
  }
}
