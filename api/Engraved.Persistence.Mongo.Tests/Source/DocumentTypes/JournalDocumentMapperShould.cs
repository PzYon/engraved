using System;
using System.Collections.Generic;
using Engraved.Core.Domain.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using FluentAssertions;
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
    createdJournal.Should().NotBeNull();
    createdJournal!.Type.Should().Be(JournalType.Counter);
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

    journal.Should().BeOfType<CounterJournal>();
    journal.Type.Should().Be(JournalType.Counter);
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
    createdJournal.Should().NotBeNull();
    createdJournal!.Type.Should().Be(JournalType.Gauge);
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

    journal.Should().BeOfType<GaugeJournal>();
    journal.Type.Should().Be(JournalType.Gauge);
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
    createdJournal.Should().NotBeNull();
    createdJournal!.Type.Should().Be(JournalType.Timer);
    AssertEqual(timerJournal, journalDocument);
    startDate.Should().Be(createdJournal.StartDate);

    journalDocument.Attributes.Should().ContainKey("flags");
    JournalAttribute attribute = journalDocument.Attributes["flags"];
    attribute.Name.Should().Be("Flags");
    attribute.Values.Should().ContainKey("fl@g");
    attribute.Values["fl@g"].Should().Be("fl@g_value");
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

    var journal = JournalDocumentMapper.FromDocument<IJournal>(timerJournalDocument);

    var timerJournal = (TimerJournal) journal;
    timerJournal.Should().NotBeNull();
    journal.Type.Should().Be(JournalType.Timer);
    timerJournal.StartDate.Should().Be(startDate);
    AssertEqual(timerJournalDocument, journal);
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

    document.Attributes.Should().NotBeNull();
    document.Attributes.Count.Should().Be(1);
    document.Attributes.Should().ContainKey("values");

    JournalAttribute attribute = document.Attributes["values"];

    attribute.Values.Count.Should().Be(2);
    attribute.Values.ContainsKey("foo").Should().BeTrue();
    attribute.Values["foo"].Should().Be("Foo");
    attribute.Values.Should().ContainKey("bar");
    attribute.Values["bar"].Should().Be("Bar");
  }

  private static void AssertEqual(IJournal expected, JournalDocument? actual)
  {
    actual!.Id.ToString().Should().Be(expected.Id);
    actual.Name.Should().Be(expected.Name);
    actual.Type.Should().Be(expected.Type);
    actual.Description.Should().Be(expected.Description);
    actual.Notes.Should().Be(expected.Notes);
    actual.EditedOn.Should().Be(expected.EditedOn);
  }

  private static void AssertEqual(JournalDocument expected, IJournal actual)
  {
    actual!.Id.Should().Be(expected.Id.ToString());
    actual.Name.Should().Be(expected.Name);
    actual.Type.Should().Be(expected.Type);
    actual.Description.Should().Be(expected.Description);
    actual.Notes.Should().Be(expected.Notes);
    actual.EditedOn.Should().Be(expected.EditedOn);
  }
}
