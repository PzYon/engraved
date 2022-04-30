using System;
using Metrix.Core.Domain.Measurements;
using Metrix.Persistence.Mongo.DocumentTypes.Measurements;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests.DocumentTypes;

public class MeasurementDocumentMapperShould
{
  private static readonly string Key = "k3y";

  [Test]
  public void Counter_ToDocument()
  {
    var measurement = new CounterMeasurement
    {
      MetricKey = Key,
      DateTime = DateTime.UtcNow,
      MetricFlagKey = "wh@t3v3r"
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
      Notes = "n0t3",
      MetricKey = Key,
      DateTime = DateTime.UtcNow,
      MetricFlagKey = "wh@t3v3r",
    };

    var counterMeasurement = MeasurementDocumentMapper.FromDocument<CounterMeasurement>(document);

    AssertEqual(document, counterMeasurement);
  }

  [Test]
  public void Gauge_ToDocument()
  {
    var measurement = new GaugeMeasurement
    {
      Notes = "n0t3",
      MetricKey = Key,
      DateTime = DateTime.UtcNow,
      MetricFlagKey = "wh@t3v3r",
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
      Notes = "n0t3",
      MetricKey = Key,
      DateTime = DateTime.UtcNow,
      MetricFlagKey = "wh@t3v3r",
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
      MetricKey = Key,
      DateTime = DateTime.UtcNow,
      MetricFlagKey = "wh@t3v3r",
      StartDate = DateTime.UtcNow.AddHours(-200),
      EndDate = DateTime.UtcNow.AddHours(-100)
    };

    MeasurementDocument document = MeasurementDocumentMapper.ToDocument(measurement);

    Assert.IsNotNull(document);

    AssertEqual(measurement, document);

    var gaugeDocument = document as TimerMeasurementDocument;
    Assert.IsNotNull(gaugeDocument);
    Assert.AreEqual(measurement.StartDate, gaugeDocument!.StartDate);
    Assert.AreEqual(measurement.EndDate, gaugeDocument!.EndDate);
  }

  [Test]
  public void Timer_FromDocument()
  {
    var document = new TimerMeasurementDocument
    {
      Notes = "n0t3",
      MetricKey = Key,
      DateTime = DateTime.UtcNow,
      MetricFlagKey = "wh@t3v3r",
      StartDate = DateTime.UtcNow.AddHours(-200),
      EndDate = DateTime.UtcNow.AddHours(-100)
    };

    var timerMeasurement = MeasurementDocumentMapper.FromDocument<TimerMeasurement>(document);

    AssertEqual(document, timerMeasurement);
  }

  private static void AssertEqual(IMeasurement expected, MeasurementDocument actual)
  {
    Assert.AreEqual(expected.DateTime, actual!.DateTime);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.MetricKey, actual.MetricKey);
    Assert.AreEqual(expected.MetricFlagKey, actual.MetricFlagKey);
  }

  private static void AssertEqual(MeasurementDocument expected, IMeasurement actual)
  {
    Assert.AreEqual(expected.DateTime, actual.DateTime);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.MetricKey, actual.MetricKey);
    Assert.AreEqual(expected.MetricFlagKey, actual.MetricFlagKey);
  }
}
