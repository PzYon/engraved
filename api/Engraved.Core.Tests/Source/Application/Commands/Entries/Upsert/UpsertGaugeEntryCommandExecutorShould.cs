using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Persistence.Mongo.Tests;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public class UpsertGaugeEntryCommandExecutorShould
{
  private TestMongoRepository _testRepository = null!;

  [SetUp]
  public async Task SetUp()
  {
    _testRepository = await Util.CreateMongoRepository();
  }

  [Test]
  [TestCase(0)]
  [TestCase(1)]
  [TestCase(123.456)]
  public async Task Set_ValueFromCommand(double value)
  {
    await _testRepository.UpsertJournal(new GaugeJournal { Id = "60703c3b00000000000000a1" });

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = "60703c3b00000000000000a1",
      Value = value
    };

    CommandResult commandResult =
      await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);

    commandResult.EntityId.Should().NotBeEmpty();
    (await _testRepository.CountAllEntries()).Should().Be(1);

    IEntry createdEntry = (await _testRepository.GetEntriesForJournal("60703c3b00000000000000a1")).First();
    createdEntry.ParentId.Should().Be(command.JournalId);

    var counterEntry = createdEntry as GaugeEntry;
    counterEntry.Should().NotBeNull();
    counterEntry.Value.Should().Be(value);
  }

  [Test]
  public void Throw_WhenNoValueIsSpecified()
  {
    _testRepository.UpsertJournal(new GaugeJournal { Id = "60703c3b00000000000000a2" }).Wait();

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = "60703c3b00000000000000a2",
      Notes = "n0t3s",
      Value = null
    };

    Assert.ThrowsAsync<InvalidCommandException>(async () =>
      {
        await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);
      }
    );
  }

  [Test]
  public async Task MapAllFieldsCorrectly()
  {
    await _testRepository.UpsertJournal(
      new GaugeJournal
      {
        Id = "60703c3b00000000000000a3",
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
      JournalId = "60703c3b00000000000000a3",
      Notes = "n0t3s",
      Value = value,
      JournalAttributeValues = new Dictionary<string, string[]>
      {
        {
          "stuff", ["k3y"]
        }
      }
    };

    await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);

    (await _testRepository.CountAllEntries()).Should().Be(1);

    IEntry createdEntry = (await _testRepository.GetEntriesForJournal("60703c3b00000000000000a3")).First();
    command.JournalId.Should().Be(createdEntry.ParentId);
    command.Notes.Should().Be(createdEntry.Notes);

    AssertJournalAttributeValuesEqual(command.JournalAttributeValues, createdEntry.JournalAttributeValues);

    var gaugeEntry = createdEntry as GaugeEntry;
    gaugeEntry.Should().NotBeNull();
    gaugeEntry.Value.Should().Be(value);
  }

  private static void AssertJournalAttributeValuesEqual(
    Dictionary<string, string[]> d1,
    Dictionary<string, string[]> d2
  )
  {
    var areEqual = d1 == d2
                   || (d1.Keys.Count == d2.Keys.Count
                       && d1.Keys.All(k => d2.ContainsKey(k) && AreEqual(d1[k], d2[k])));

    areEqual.Should().BeTrue("JournalAttributeValues are not equal.");
  }

  private static bool AreEqual(IEnumerable<string> first, IEnumerable<string> second)
  {
    first.Should().BeEquivalentTo(second);
    return true;
  }

  // todo: Add test for value key
  [Test]
  public async Task Throw_WhenJournalAttributeKeyDoesNotExistOnJournal()
  {
    await _testRepository.UpsertJournal(new GaugeJournal { Id = "60703c3b00000000000000a4" });

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = "60703c3b00000000000000a4",
      Notes = "n0t3s",
      Value = 42,
      JournalAttributeValues = new Dictionary<string, string[]> { { "fooBar", ["x"] } }
    };

    Assert.ThrowsAsync<InvalidCommandException>(async () =>
      {
        await new UpsertGaugeEntryCommandExecutor(_testRepository, new FakeDateService()).Execute(command);
      }
    );
  }
}
