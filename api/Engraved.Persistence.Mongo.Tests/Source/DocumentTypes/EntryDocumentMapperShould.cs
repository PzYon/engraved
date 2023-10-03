using System;
using System.Collections.Generic;
using Engraved.Core.Domain.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
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

    Assert.IsNotNull(document);
    AssertEqual(entry, document);
    Assert.IsNotNull(document as CounterEntryDocument);
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

    Assert.IsNotNull(document);

    AssertEqual(entry, document);

    var gaugeDocument = document as GaugeEntryDocument;
    Assert.IsNotNull(gaugeDocument);
    Assert.AreEqual(entry.Value, gaugeDocument!.Value);
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

    Assert.IsNotNull(document);

    AssertEqual(entry, document);

    var gaugeDocument = document as TimerEntryDocument;
    Assert.IsNotNull(gaugeDocument);
    Assert.AreEqual(entry.StartDate, gaugeDocument!.StartDate);
    Assert.AreEqual(entry.EndDate, gaugeDocument.EndDate);
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
    Assert.AreEqual(expected.DateTime, actual.DateTime);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.ParentId, actual.ParentId);
    Assert.AreEqual(expected.JournalAttributeValues, actual.JournalAttributeValues);
  }

  private static void AssertEqual(EntryDocument expected, IEntry actual)
  {
    Assert.AreEqual(expected.Id.ToString(), actual.Id);
    Assert.AreEqual(expected.DateTime, actual.DateTime);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.ParentId, actual.ParentId);
    Assert.AreEqual(expected.JournalAttributeValues, actual.JournalAttributeValues);
  }
}
