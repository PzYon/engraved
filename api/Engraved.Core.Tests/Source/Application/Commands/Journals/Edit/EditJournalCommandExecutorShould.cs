using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.Edit;

public class EditJournalCommandExecutorShould
{
  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task RemoveDeletedJournalAttributesFromAllJournalEntries()
  {
    const string journalId = "60703c3b0000000000000001";
    const string otherJournalId = "60703c3b0000000000000002";
    const string entryId1 = "60703c3b0000000000000003";
    const string entryId2 = "60703c3b0000000000000004";
    const string entryId3 = "60703c3b0000000000000005";

    await _repo.UpsertJournal(
      new GaugeJournal
      {
        Id = journalId,
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "color", new JournalAttribute { Name = "Color", Values = new Dictionary<string, string> { { "red", "Red" } } } },
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );
    await _repo.UpsertJournal(new GaugeJournal { Id = otherJournalId, Name = "other-journal" });

    await _repo.UpsertEntry(
      new GaugeEntry
      {
        Id = entryId1,
        ParentId = journalId,
        JournalAttributeValues = new Dictionary<string, string[]>
        {
          { "color", ["red"] },
          { "size", ["large"] },
          { "other", ["keep"] }
        }
      }
    );
    await _repo.UpsertEntry(
      new GaugeEntry
      {
        Id = entryId2,
        ParentId = journalId,
        JournalAttributeValues = new Dictionary<string, string[]> { { "color", ["red"] } }
      }
    );
    await _repo.UpsertEntry(
      new GaugeEntry
      {
        Id = entryId3,
        ParentId = otherJournalId,
        JournalAttributeValues = new Dictionary<string, string[]> { { "color", ["red"] } }
      }
    );

    await new EditJournalCommandExecutor(_repo, new FakeDateService()).Execute(
      new EditJournalCommand
      {
        JournalId = journalId,
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );

    IEntry[] editedJournalEntries = await _repo.GetEntriesForJournal(journalId);
    editedJournalEntries.Should().HaveCount(2);
    editedJournalEntries.Should().OnlyContain(entry => !entry.JournalAttributeValues.ContainsKey("color"));
    editedJournalEntries.SelectMany(entry => entry.JournalAttributeValues.Keys).Should().Contain("size");
    editedJournalEntries.SelectMany(entry => entry.JournalAttributeValues.Keys).Should().Contain("other");

    IEntry? otherJournalEntry = await _repo.GetEntry(entryId3);
    otherJournalEntry.Should().NotBeNull();
    otherJournalEntry!.JournalAttributeValues.Should().ContainKey("color");
  }

  [Test]
  public async Task KeepAllEntryAttributes_WhenNoJournalAttributeWasDeleted()
  {
    const string journalId = "60703c3b0000000000000006";
    const string entryId = "60703c3b0000000000000007";

    await _repo.UpsertJournal(
      new GaugeJournal
      {
        Id = journalId,
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "color", new JournalAttribute { Name = "Color", Values = new Dictionary<string, string> { { "red", "Red" } } } },
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );

    await _repo.UpsertEntry(
      new GaugeEntry
      {
        Id = entryId,
        ParentId = journalId,
        JournalAttributeValues = new Dictionary<string, string[]>
        {
          { "color", ["red"] },
          { "size", ["large"] }
        }
      }
    );

    await new EditJournalCommandExecutor(_repo, new FakeDateService()).Execute(
      new EditJournalCommand
      {
        JournalId = journalId,
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "color", new JournalAttribute { Name = "Color", Values = new Dictionary<string, string> { { "red", "Red" } } } },
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );

    IEntry? entry = await _repo.GetEntry(entryId);
    entry.Should().NotBeNull();
    entry!.JournalAttributeValues.Should().ContainKey("color");
    entry.JournalAttributeValues.Should().ContainKey("size");
  }
}
