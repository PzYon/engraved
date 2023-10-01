using System;
using System.Collections.Generic;
using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Metrics;
using MongoDB.Bson;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests.DocumentTypes;

public class JournalDocumentMapperShould
{
  private static readonly string Id = MongoUtil.GenerateNewIdAsString();
  private static readonly string Name = "N@me";
  private static readonly string Description = "D3scription";
  private static readonly string Notes = "N0t3s";

  [Test]
  public void Counter_ToDocument()
  {
    var counterJournal = new CounterJournal
    {
      Id = Id,
      Name = Name,
      Description = Description,
      Notes = Notes,
      EditedOn = DateTime.UtcNow
    };

    JournalDocument journalDocument = JournalDocumentMapper.ToDocument(counterJournal);

    var createdJournal = journalDocument as CounterJournalDocument;
    Assert.IsNotNull(createdJournal);
    Assert.AreEqual(JournalType.Counter, createdJournal!.Type);
    AssertEqual(counterJournal, createdJournal);
  }

  [Test]
  public void Counter_FromDocument()
  {
    var counterJournalDocument = new CounterJournalDocument
    {
      Id = new ObjectId(Id),
      Description = Description,
      Notes = Notes,
      Name = Name
    };

    var journal = JournalDocumentMapper.FromDocument<IJournal>(counterJournalDocument);

    Assert.IsTrue(journal is CounterJournal);
    Assert.AreEqual(JournalType.Counter, journal.Type);
    AssertEqual(counterJournalDocument, journal);
  }

  [Test]
  public void Gauge_ToDocument()
  {
    var gaugeJournal = new GaugeJournal
    {
      Id = Id,
      Name = Name,
      Description = Description,
      Notes = Notes
    };

    JournalDocument journalDocument = JournalDocumentMapper.ToDocument(gaugeJournal);

    var createdJournal = journalDocument as GaugeJournalDocument;
    Assert.IsNotNull(createdJournal);
    Assert.AreEqual(JournalType.Gauge, createdJournal!.Type);
    AssertEqual(gaugeJournal, journalDocument);
  }

  [Test]
  public void Gauge_FromDocument()
  {
    var gaugeJournalDocument = new GaugeJournalDocument
    {
      Id = new ObjectId(Id),
      Description = Description,
      Name = Name,
      Notes = Notes
    };

    var journal = JournalDocumentMapper.FromDocument<IJournal>(gaugeJournalDocument);

    Assert.IsTrue(journal is GaugeJournal);
    Assert.AreEqual(JournalType.Gauge, journal.Type);
    AssertEqual(gaugeJournalDocument, journal);
  }

  [Test]
  public void Timer_ToDocument()
  {
    DateTime startDate = DateTime.UtcNow;

    var timerJournal = new TimerJournal
    {
      Id = Id,
      Name = Name,
      Description = Description,
      Notes = Notes,
      Attributes = new Dictionary<string, JournalAttribute>
      {
        {
          "flags", new JournalAttribute
          {
            Name = "Flags",
            Values = { { "fl@g", "fl@g_value" } }
          }
        }
      },
      StartDate = startDate
    };

    JournalDocument journalDocument = JournalDocumentMapper.ToDocument(timerJournal);

    var createdJournal = journalDocument as TimerJournalDocument;
    Assert.IsNotNull(createdJournal);
    Assert.AreEqual(JournalType.Timer, createdJournal!.Type);
    AssertEqual(timerJournal, journalDocument);
    Assert.AreEqual(startDate, createdJournal.StartDate);

    Assert.Contains("flags", journalDocument.Attributes.Keys);
    JournalAttribute attribute = journalDocument.Attributes["flags"];
    Assert.AreEqual("Flags", attribute.Name);
    Assert.Contains("fl@g", attribute.Values.Keys);
    Assert.AreEqual("fl@g_value", attribute.Values["fl@g"]);
  }

  [Test]
  public void Timer_FromDocument()
  {
    DateTime startDate = DateTime.UtcNow;

    var timerJournalDocument = new TimerJournalDocument
    {
      Id = new ObjectId(Id),
      Description = Description,
      Name = Name,
      Notes = Notes,
      StartDate = startDate
    };

    var metric = JournalDocumentMapper.FromDocument<IJournal>(timerJournalDocument);

    var timerJournal = (TimerJournal) metric;
    Assert.IsNotNull(timerJournal);
    Assert.AreEqual(JournalType.Timer, metric.Type);
    Assert.AreEqual(startDate, timerJournal.StartDate);
    AssertEqual(timerJournalDocument, metric);
  }

  [Test]
  public void Counter_Attributes()
  {
    var journal = new CounterJournal
    {
      Id = Id,
      Description = Description,
      Name = Name,
      Notes = Notes,
      Attributes = new Dictionary<string, JournalAttribute>
      {
        {
          "values",
          new JournalAttribute
          {
            Name = "Some Values",
            Values =
            {
              { "foo", "Foo" },
              { "bar", "Bar" }
            }
          }
        }
      }
    };

    JournalDocument document = JournalDocumentMapper.ToDocument(journal);

    Assert.IsNotNull(document.Attributes);
    Assert.AreEqual(1, document.Attributes.Count);
    Assert.IsTrue(document.Attributes.ContainsKey("values"));

    JournalAttribute attribute = document.Attributes["values"];

    Assert.AreEqual(2, attribute.Values.Count);
    Assert.IsTrue(attribute.Values.ContainsKey("foo"));
    Assert.IsTrue(attribute.Values["foo"] == "Foo");
    Assert.IsTrue(attribute.Values.ContainsKey("bar"));
    Assert.IsTrue(attribute.Values["bar"] == "Bar");
  }

  private static void AssertEqual(IJournal expected, JournalDocument? actual)
  {
    Assert.AreEqual(expected.Id, actual!.Id.ToString());
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.EditedOn, actual.EditedOn);
  }

  private static void AssertEqual(JournalDocument expected, IJournal actual)
  {
    Assert.AreEqual(expected.Id.ToString(), actual.Id);
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.EditedOn, actual.EditedOn);
  }
}
