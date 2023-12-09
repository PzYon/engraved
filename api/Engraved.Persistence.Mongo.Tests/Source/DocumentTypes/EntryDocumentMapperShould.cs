using System;
using System.Collections.Generic;
using Engraved.Core.Domain.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using FluentAssertions;
using MongoDB.Bson;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests.DocumentTypes;

public class EntryDocumentMapperShould
{
  private static readonly string Id = MongoUtil.GenerateNewIdAsString();
  private static readonly string Key = "k3y";

  [Test]
  public void Counter_ToDocument()
  {
    var entry = new CounterEntry
    {
      Id = Id,
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } }
    };

    EntryDocument document = EntryDocumentMapper.ToDocument(entry);

    document.Should().NotBeNull();
    AssertEqual(entry, document);
    (document as CounterEntryDocument).Should().NotBeNull();
  }

  [Test]
  public void Counter_FromDocument()
  {
    var document = new CounterEntryDocument
    {
      Id = new ObjectId(Id),
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } }
    };

    var counterEntry = EntryDocumentMapper.FromDocument<CounterEntry>(document);

    AssertEqual(document, counterEntry);
  }

  [Test]
  public void Gauge_ToDocument()
  {
    var entry = new GaugeEntry
    {
      Id = Id,
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      Value = 4.20
    };

    EntryDocument document = EntryDocumentMapper.ToDocument(entry);

    document.Should().NotBeNull();

    AssertEqual(entry, document);

    var gaugeDocument = document as GaugeEntryDocument;
    gaugeDocument.Should().NotBeNull();
    gaugeDocument!.Value.Should().Be(entry.Value);
  }

  [Test]
  public void Gauge_FromDocument()
  {
    var document = new GaugeEntryDocument
    {
      Id = new ObjectId(Id),
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      Value = 4321
    };

    var gaugeEntry = EntryDocumentMapper.FromDocument<GaugeEntry>(document);

    AssertEqual(document, gaugeEntry);
  }

  [Test]
  public void Timer_ToDocument()
  {
    var entry = new TimerEntry
    {
      Id = Id,
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      StartDate = DateTime.UtcNow.AddHours(-200),
      EndDate = DateTime.UtcNow.AddHours(-100)
    };

    EntryDocument document = EntryDocumentMapper.ToDocument(entry);

    document.Should().NotBeNull();

    AssertEqual(entry, document);

    var gaugeDocument = document as TimerEntryDocument;
    gaugeDocument.Should().NotBeNull();
    entry.StartDate.Should().Be(gaugeDocument!.StartDate);
    entry.EndDate.Should().Be(gaugeDocument.EndDate);
  }

  [Test]
  public void Timer_FromDocument()
  {
    var document = new TimerEntryDocument
    {
      Id = new ObjectId(Id),
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      StartDate = DateTime.UtcNow.AddHours(-200),
      EndDate = DateTime.UtcNow.AddHours(-100)
    };

    var timerEntry = EntryDocumentMapper.FromDocument<TimerEntry>(document);

    AssertEqual(document, timerEntry);
  }

  private static void AssertEqual(IEntry expected, EntryDocument actual)
  {
    actual.DateTime.Should().Be(expected.DateTime);
    actual.Notes.Should().Be(expected.Notes);
    actual.ParentId.Should().Be(expected.ParentId);
    actual.JournalAttributeValues.Should().BeEquivalentTo(expected.JournalAttributeValues);
  }

  private static void AssertEqual(EntryDocument expected, IEntry actual)
  {
    actual.Id.Should().Be(expected.Id.ToString());
    actual.DateTime.Should().Be(expected.DateTime);
    actual.Notes.Should().Be(expected.Notes);
    actual.ParentId.Should().Be(expected.ParentId);
    actual.JournalAttributeValues.Should().BeEquivalentTo(expected.JournalAttributeValues);
  }
}
