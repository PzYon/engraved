using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.Edit;

public class EditJournalCommandExecutorShould
{
  private InMemoryRepository _repo = null!;

  [SetUp]
  public void SetUp()
  {
    _repo = new InMemoryRepository();
  }

  [Test]
  public async Task RemoveDeletedJournalAttributesFromAllJournalEntries()
  {
    _repo.Journals.Add(
      new GaugeJournal
      {
        Id = "journal-id",
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "color", new JournalAttribute { Name = "Color", Values = new Dictionary<string, string> { { "red", "Red" } } } },
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );
    _repo.Journals.Add(new GaugeJournal { Id = "other-journal-id", Name = "other-journal" });

    _repo.Entries.Add(
      new GaugeEntry
      {
        Id = "entry-1",
        ParentId = "journal-id",
        JournalAttributeValues = new Dictionary<string, string[]>
        {
          { "color", ["red"] },
          { "size", ["large"] },
          { "other", ["keep"] }
        }
      }
    );
    _repo.Entries.Add(
      new GaugeEntry
      {
        Id = "entry-2",
        ParentId = "journal-id",
        JournalAttributeValues = new Dictionary<string, string[]> { { "color", ["red"] } }
      }
    );
    _repo.Entries.Add(
      new GaugeEntry
      {
        Id = "entry-3",
        ParentId = "other-journal-id",
        JournalAttributeValues = new Dictionary<string, string[]> { { "color", ["red"] } }
      }
    );

    await new EditJournalCommandExecutor(_repo, new FakeDateService()).Execute(
      new EditJournalCommand
      {
        JournalId = "journal-id",
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );

    IEntry[] editedJournalEntries = await _repo.GetEntriesForJournal("journal-id");
    editedJournalEntries.Should().HaveCount(2);
    editedJournalEntries.Should().OnlyContain(entry => !entry.JournalAttributeValues.ContainsKey("color"));
    editedJournalEntries.SelectMany(entry => entry.JournalAttributeValues.Keys).Should().Contain("size");
    editedJournalEntries.SelectMany(entry => entry.JournalAttributeValues.Keys).Should().Contain("other");

    IEntry? otherJournalEntry = await _repo.GetEntry("entry-3");
    otherJournalEntry.Should().NotBeNull();
    otherJournalEntry!.JournalAttributeValues.Should().ContainKey("color");
  }

  [Test]
  public async Task KeepAllEntryAttributes_WhenNoJournalAttributeWasDeleted()
  {
    _repo.Journals.Add(
      new GaugeJournal
      {
        Id = "journal-id",
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "color", new JournalAttribute { Name = "Color", Values = new Dictionary<string, string> { { "red", "Red" } } } },
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );

    _repo.Entries.Add(
      new GaugeEntry
      {
        Id = "entry-1",
        ParentId = "journal-id",
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
        JournalId = "journal-id",
        Name = "journal-name",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          { "color", new JournalAttribute { Name = "Color", Values = new Dictionary<string, string> { { "red", "Red" } } } },
          { "size", new JournalAttribute { Name = "Size", Values = new Dictionary<string, string> { { "large", "Large" } } } }
        }
      }
    );

    IEntry? entry = await _repo.GetEntry("entry-1");
    entry.Should().NotBeNull();
    entry!.JournalAttributeValues.Should().ContainKey("color");
    entry.JournalAttributeValues.Should().ContainKey("size");
  }
}
