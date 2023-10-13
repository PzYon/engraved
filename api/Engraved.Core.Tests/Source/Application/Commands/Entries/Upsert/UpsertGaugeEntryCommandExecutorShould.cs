using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public class UpsertGaugeEntryCommandExecutorShould
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

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = "k3y",
      Value = value
    };

    CommandResult commandResult =
      await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);

    Assert.IsFalse(string.IsNullOrEmpty(commandResult.EntityId));

    Assert.AreEqual(1, _testRepository.Entries.Count);

    IEntry createdEntry = _testRepository.Entries.First();
    Assert.AreEqual(command.JournalId, createdEntry.ParentId);

    var counterEntry = createdEntry as GaugeEntry;
    Assert.IsNotNull(counterEntry);
    Assert.AreEqual(value, counterEntry!.Value);
  }

  [Test]
  public void Throw_WhenNoValueIsSpecified()
  {
    _testRepository.Journals.Add(new GaugeJournal { Id = "k3y" });

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s",
      Value = null
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);
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

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s",
      Value = value,
      JournalAttributeValues = new Dictionary<string, string[]>
      {
        {
          "stuff", new[] { "k3y" }
        }
      }
    };

    await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);

    Assert.AreEqual(1, _testRepository.Entries.Count);

    IEntry createdEntry = _testRepository.Entries.First();
    Assert.AreEqual(command.JournalId, createdEntry.ParentId);
    Assert.AreEqual(command.Notes, createdEntry.Notes);

    AssertJournalAttributeValuesEqual(command.JournalAttributeValues, createdEntry.JournalAttributeValues);

    var gaugeEntry = createdEntry as GaugeEntry;
    Assert.IsNotNull(gaugeEntry);
    Assert.AreEqual(value, gaugeEntry!.Value);
  }

  private static void AssertJournalAttributeValuesEqual(
    Dictionary<string, string[]> d1,
    Dictionary<string, string[]> d2
  )
  {
    bool areEqual = d1 == d2
                    || (d1.Keys.Count == d2.Keys.Count
                        && d1.Keys.All(k => d2.ContainsKey(k) && AreEqual(d1[k], d2[k])));
    if (!areEqual)
    {
      Assert.Fail("JournalAttributeValues are not equal.");
    }
  }

  private static bool AreEqual(IEnumerable<string> first, IEnumerable<string> second)
  {
    CollectionAssert.AreEquivalent(first, second);
    return true;
  }

  // todo: Add test for value key
  [Test]
  public void Throw_WhenJournalAttributeKeyDoesNotExistOnJournal()
  {
    _testRepository.Journals.Add(new GaugeJournal { Id = "k3y" });

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = "k3y",
      Notes = "n0t3s",
      Value = 42,
      JournalAttributeValues = new Dictionary<string, string[]> { { "fooBar", new[] { "x" } } }
    };

    Assert.ThrowsAsync<InvalidCommandException>(
      async () =>
      {
        await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);
      }
    );
  }
}
