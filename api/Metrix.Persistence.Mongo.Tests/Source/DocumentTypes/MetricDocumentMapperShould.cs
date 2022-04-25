using System;
using System.Collections.Generic;
using Metrix.Core.Domain.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests.DocumentTypes;

public class MetricDocumentMapperShould
{
  private static readonly string Key = "k3y";
  private static readonly string Name = "N@me";
  private static readonly string Description = "D3scription";

  [Test]
  public void Counter_ToDocument()
  {
    var counterMetric = new CounterMetric
    {
      Key = Key,
      Name = Name,
      Description = Description,
      LastMeasurementDate = DateTime.UtcNow
    };

    IMetricDocument metricDocument = MetricDocumentMapper.ToDocument(counterMetric);

    var createdMetric = metricDocument as CounterMetricDocument;
    Assert.IsNotNull(createdMetric);
    Assert.AreEqual(MetricType.Counter, createdMetric!.Type);
    AssertEqual(counterMetric, createdMetric);
  }

  [Test]
  public void Counter_FromDocument()
  {
    var counterMetricDocument = new CounterMetricDocument
    {
      Key = Key,
      Description = Description,
      Name = Name
    };

    var metric = MetricDocumentMapper.FromDocument<IMetric>(counterMetricDocument);

    Assert.IsTrue(metric is CounterMetric);
    Assert.AreEqual(MetricType.Counter, metric.Type);
    AssertEqual(counterMetricDocument, metric);
  }

  [Test]
  public void Gauge_ToDocument()
  {
    var gaugeMetric = new GaugeMetric
    {
      Key = Key,
      Name = Name,
      Description = Description
    };

    IMetricDocument metricDocument = MetricDocumentMapper.ToDocument(gaugeMetric);

    var createdMetric = metricDocument as GaugeMetricDocument;
    Assert.IsNotNull(createdMetric);
    Assert.AreEqual(MetricType.Gauge, createdMetric!.Type);
    AssertEqual(gaugeMetric, metricDocument);
  }

  [Test]
  public void Gauge_FromDocument()
  {
    var gaugeMetricDocument = new GaugeMetricDocument
    {
      Key = Key,
      Description = Description,
      Name = Name
    };

    var metric = MetricDocumentMapper.FromDocument<IMetric>(gaugeMetricDocument);

    Assert.IsTrue(metric is GaugeMetric);
    Assert.AreEqual(MetricType.Gauge, metric.Type);
    AssertEqual(gaugeMetricDocument, metric);
  }

  [Test]
  public void Timer_ToDocument()
  {
    var timerMetric = new TimerMetric
    {
      Key = Key,
      Name = Name,
      Description = Description,
      Flags = new Dictionary<string, string> { { "fl@g", "fl@g_value" } }
    };

    IMetricDocument metricDocument = MetricDocumentMapper.ToDocument(timerMetric);

    var createdMetric = metricDocument as TimerMetricDocument;
    Assert.IsNotNull(createdMetric);
    Assert.AreEqual(MetricType.Timer, createdMetric!.Type);
    AssertEqual(timerMetric, metricDocument);
    Assert.Contains("fl@g", metricDocument.Flags.Keys);
    Assert.AreEqual("fl@g_value", metricDocument.Flags["fl@g"]);
  }

  [Test]
  public void Timer_FromDocument()
  {
    var timerMetricDocument = new TimerMetricDocument
    {
      Key = Key,
      Description = Description,
      Name = Name
    };

    var metric = MetricDocumentMapper.FromDocument<IMetric>(timerMetricDocument);

    Assert.IsTrue(metric is TimerMetric);
    Assert.AreEqual(MetricType.Timer, metric.Type);
    AssertEqual(timerMetricDocument, metric);
  }

  private static void AssertEqual(IMetric expected, IMetricDocument? actual)
  {
    Assert.AreEqual(expected.Key, actual!.Key);
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.LastMeasurementDate, actual.LastMeasurementDate);
  }

  private static void AssertEqual(IMetricDocument expected, IMetric actual)
  {
    Assert.AreEqual(expected.Key, actual!.Key);
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.LastMeasurementDate, actual.LastMeasurementDate);
  }
}
