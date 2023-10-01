﻿using System;
using System.Collections.Generic;
using Engraved.Core.Domain.Measurements;
using Engraved.Persistence.Mongo.DocumentTypes.Measurements;
using MongoDB.Bson;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests.DocumentTypes;

public class MeasurementDocumentMapperShould
{
  private static readonly string Id = MongoUtil.GenerateNewIdAsString();
  private static readonly string Key = "k3y";

  [Test]
  public void Counter_ToDocument()
  {
    var measurement = new CounterMeasurement
    {
      Id = Id,
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } }
    };

    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    Assert.IsNotNull(document);
    AssertEqual(measurement, document);
    Assert.IsNotNull(document as CounterMeasurementDocument);
  }

  [Test]
  public void Counter_FromDocument()
  {
    var document = new CounterMeasurementDocument
    {
      Id = new ObjectId(Id),
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } }
    };

    var counterMeasurement = MeasurementDocumentMapper.FromDocument<CounterMeasurement>(document);

    AssertEqual(document, counterMeasurement);
  }

  [Test]
  public void Gauge_ToDocument()
  {
    var measurement = new GaugeMeasurement
    {
      Id = Id,
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      Value = 4.20
    };

    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    Assert.IsNotNull(document);

    AssertEqual(measurement, document);

    var gaugeDocument = document as GaugeMeasurementDocument;
    Assert.IsNotNull(gaugeDocument);
    Assert.AreEqual(measurement.Value, gaugeDocument!.Value);
  }

  [Test]
  public void Gauge_FromDocument()
  {
    var document = new GaugeMeasurementDocument
    {
      Id = new ObjectId(Id),
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      Value = 4321
    };

    var gaugeMeasurement = MeasurementDocumentMapper.FromDocument<GaugeMeasurement>(document);

    AssertEqual(document, gaugeMeasurement);
  }

  [Test]
  public void Timer_ToDocument()
  {
    var measurement = new TimerMeasurement
    {
      Id = Id,
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      StartDate = DateTime.UtcNow.AddHours(-200),
      EndDate = DateTime.UtcNow.AddHours(-100)
    };

    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    Assert.IsNotNull(document);

    AssertEqual(measurement, document);

    var gaugeDocument = document as TimerMeasurementDocument;
    Assert.IsNotNull(gaugeDocument);
    Assert.AreEqual(measurement.StartDate, gaugeDocument!.StartDate);
    Assert.AreEqual(measurement.EndDate, gaugeDocument.EndDate);
  }

  [Test]
  public void Timer_FromDocument()
  {
    var document = new TimerMeasurementDocument
    {
      Id = new ObjectId(Id),
      Notes = "n0t3",
      ParentId = Key,
      DateTime = DateTime.UtcNow,
      JournalAttributeValues = new Dictionary<string, string[]> { { "wh@t3v3r", new[] { "bla" } } },
      StartDate = DateTime.UtcNow.AddHours(-200),
      EndDate = DateTime.UtcNow.AddHours(-100)
    };

    var timerMeasurement = MeasurementDocumentMapper.FromDocument<TimerMeasurement>(document);

    AssertEqual(document, timerMeasurement);
  }

  private static void AssertEqual(IMeasurement expected, MeasurementDocument actual)
  {
    Assert.AreEqual(expected.DateTime, actual.DateTime);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.ParentId, actual.ParentId);
    Assert.AreEqual(expected.JournalAttributeValues, actual.JournalAttributeValues);
  }

  private static void AssertEqual(MeasurementDocument expected, IMeasurement actual)
  {
    Assert.AreEqual(expected.Id.ToString(), actual.Id);
    Assert.AreEqual(expected.DateTime, actual.DateTime);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.ParentId, actual.ParentId);
    Assert.AreEqual(expected.JournalAttributeValues, actual.JournalAttributeValues);
  }
}
