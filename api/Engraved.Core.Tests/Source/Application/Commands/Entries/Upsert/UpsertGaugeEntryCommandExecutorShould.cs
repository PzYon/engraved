using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Entries.Upsert;

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
    const string journalId = "60703c3b00000000000000a1";
    await _testRepository.UpsertJournal(new GaugeJournal { Id = journalId });

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = journalId,
      Value = value
    };

    CommandResult commandResult =
      await new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository, new FakeDateService()).Execute(
        command
      );

    commandResult.EntityId.Should().NotBeEmpty();
    (await _testRepository.CountAllEntries()).Should().Be(1);

    IEntry createdEntry = (await _testRepository.GetEntriesForJournal(journalId)).First();
    createdEntry.ParentId.Should().Be(command.JournalId);

    var counterEntry = createdEntry as GaugeEntry;
    counterEntry.Should().NotBeNull();
    counterEntry.Value.Should().Be(value);
  }

  [Test]
  public async Task Throw_WhenNoValueIsSpecified()
  {
    const string journalId = "60703c3b00000000000000a2";
    await _testRepository.UpsertJournal(new GaugeJournal { Id = journalId });

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = journalId,
      Notes = "n0t3s",
      Value = null
    };

    Assert.ThrowsAsync<InvalidCommandException>(async () =>
      {
        await new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository, new FakeDateService()).Execute(
          command
        );
      }
    );
  }

  [Test]
  public async Task MapAllFieldsCorrectly()
  {
    const string journalId = "60703c3b00000000000000a3";
    await _testRepository.UpsertJournal(
      new GaugeJournal
      {
        Id = journalId,
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
      JournalId = journalId,
      Notes = "n0t3s",
      Value = value,
      JournalAttributeValues = new Dictionary<string, string[]>
      {
        {
          "stuff", ["k3y"]
        }
      }
    };

    await new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository, new FakeDateService()).Execute(command);

    (await _testRepository.CountAllEntries()).Should().Be(1);

    IEntry createdEntry = (await _testRepository.GetEntriesForJournal(journalId)).First();
    command.JournalId.Should().Be(createdEntry.ParentId);
    command.Notes.Should().Be(createdEntry.Notes);

    AssertJournalAttributeValuesEqual(command.JournalAttributeValues, createdEntry.JournalAttributeValues);

    var gaugeEntry = createdEntry as GaugeEntry;
    gaugeEntry.Should().NotBeNull();
    gaugeEntry.Value.Should().Be(value);
  }

  [Test]
  public async Task Create_WithClientGeneratedId()
  {
    const string journalId = "60703c3b00000000000000a5";
    await _testRepository.UpsertJournal(new GaugeJournal { Id = journalId });

    const string clientGeneratedId = "66703c3b00000000000000f1";

    var command = new UpsertGaugeEntryCommand
    {
      Id = clientGeneratedId,
      IsNew = true,
      JournalId = journalId,
      Value = 42
    };

    CommandResult commandResult =
      await new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository, new FakeDateService()).Execute(
        command
      );

    commandResult.Discarded.Should().BeFalse();
    commandResult.EntityId.Should().Be(clientGeneratedId);
    (await _testRepository.CountAllEntries()).Should().Be(1);
    (await _testRepository.GetEntry(clientGeneratedId)).Should().NotBeNull();
  }

  [Test]
  public async Task Create_WithClientGeneratedId_IsIdempotentOnReplay()
  {
    const string journalId = "60703c3b00000000000000a6";
    await _testRepository.UpsertJournal(new GaugeJournal { Id = journalId });

    var command = new UpsertGaugeEntryCommand
    {
      Id = "66703c3b00000000000000f2",
      IsNew = true,
      JournalId = journalId,
      Value = 42
    };

    var executor = new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository, new FakeDateService());
    await executor.Execute(command);
    CommandResult replayResult = await executor.Execute(command);

    replayResult.Discarded.Should().BeFalse();
    replayResult.EntityId.Should().Be(command.Id);
    (await _testRepository.CountAllEntries()).Should().Be(1);
  }

  [Test]
  public async Task Discard_UpdateOfEntryThatNoLongerExists()
  {
    const string journalId = "60703c3b00000000000000a7";
    await _testRepository.UpsertJournal(new GaugeJournal { Id = journalId });

    // not flagged IsNew, i.e. an update - but the entry does not exist (any more)
    var command = new UpsertGaugeEntryCommand
    {
      Id = "66703c3b00000000000000f3",
      JournalId = journalId,
      Value = 42
    };

    CommandResult commandResult =
      await new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository, new FakeDateService()).Execute(
        command
      );

    commandResult.Discarded.Should().BeTrue();
    commandResult.EntityId.Should().Be(command.Id);
    (await _testRepository.CountAllEntries()).Should().Be(0);

    // a discarded command must not touch the journal either
    (await _testRepository.GetJournal(journalId))!.EditedOn.Should().BeNull();
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
    const string journalId = "60703c3b00000000000000a4";
    await _testRepository.UpsertJournal(new GaugeJournal { Id = journalId });

    var command = new UpsertGaugeEntryCommand
    {
      JournalId = journalId,
      Notes = "n0t3s",
      Value = 42,
      JournalAttributeValues = new Dictionary<string, string[]> { { "fooBar", ["x"] } }
    };

    Assert.ThrowsAsync<InvalidCommandException>(async () =>
      {
        await new UpsertGaugeEntryCommandExecutor(_testRepository, _testRepository, new FakeDateService()).Execute(
          command
        );
      }
    );
  }
}
