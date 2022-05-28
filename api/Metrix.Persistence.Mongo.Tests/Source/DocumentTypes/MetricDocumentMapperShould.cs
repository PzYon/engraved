using System;
using System.Collections.Generic;
using Metrix.Core.Domain.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using MongoDB.Bson;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests.DocumentTypes;

public class MetricDocumentMapperShould
{
  private static readonly string Id = ObjectId.GenerateNewId().ToString();
  private static readonly string Name = "N@me";
  private static readonly string Description = "D3scription";

  [Test]
  public void Counter_ToDocument()
  {
    var counterMetric = new CounterMetric
    {
      Id = Id,
      Name = Name,
      Description = Description,
      LastMeasurementDate = DateTime.UtcNow
    };

    MetricDocument metricDocument = MetricDocumentMapper.ToDocument(counterMetric);

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
      Id = new ObjectId(Id),
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
      Id = Id,
      Name = Name,
      Description = Description
    };

    MetricDocument metricDocument = MetricDocumentMapper.ToDocument(gaugeMetric);

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
      Id = new ObjectId(Id),
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
    DateTime startDate = DateTime.UtcNow;

    var timerMetric = new TimerMetric
    {
      Id = Id,
      Name = Name,
      Description = Description,
      Flags = new Dictionary<string, MetricProps>
      {
        {
          "flags", new MetricProps()
          {
            Name = "Flags",
            Values = { { "fl@g", "fl@g_value" } }
          }
        }
      },
      StartDate = startDate
    };

    MetricDocument metricDocument = MetricDocumentMapper.ToDocument(timerMetric);

    var createdMetric = metricDocument as TimerMetricDocument;
    Assert.IsNotNull(createdMetric);
    Assert.AreEqual(MetricType.Timer, createdMetric!.Type);
    AssertEqual(timerMetric, metricDocument);
    Assert.AreEqual(startDate, createdMetric.StartDate);

    Assert.Contains("flags", metricDocument.Flags.Keys);
    MetricProps props = metricDocument.Flags["flags"];
    Assert.AreEqual("Flags", props.Name);
    Assert.Contains("fl@g", props.Values.Keys);
    Assert.AreEqual("fl@g_value",props.Values["fl@g"]);
  }

  [Test]
  public void Timer_FromDocument()
  {
    DateTime startDate = DateTime.UtcNow;

    var timerMetricDocument = new TimerMetricDocument
    {
      Id = new ObjectId(Id),
      Description = Description,
      Name = Name,
      StartDate = startDate
    };

    var metric = MetricDocumentMapper.FromDocument<IMetric>(timerMetricDocument);

    var timerMetric = (TimerMetric)metric;
    Assert.IsNotNull(timerMetric);
    Assert.AreEqual(MetricType.Timer, metric.Type);
    Assert.AreEqual(startDate, timerMetric.StartDate);
    AssertEqual(timerMetricDocument, metric);
  }

  [Test]
  public void Counter_Flags()
  {
    var metric = new CounterMetric
    {
      Id = Id,
      Description = Description,
      Name = Name,
      Flags = new Dictionary<string, MetricProps>
      {
        {
          "values",
          new MetricProps
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

    MetricDocument document = MetricDocumentMapper.ToDocument(metric);

    Assert.IsNotNull(document.Flags);
    Assert.AreEqual(1, document.Flags.Count);
    Assert.IsTrue(document.Flags.ContainsKey("values"));

    MetricProps props = document.Flags["values"];

    Assert.AreEqual(2, props.Values.Count);
    Assert.IsTrue(props.Values.ContainsKey("foo"));
    Assert.IsTrue(props.Values["foo"] == "Foo");
    Assert.IsTrue(props.Values.ContainsKey("bar"));
    Assert.IsTrue(props.Values["bar"] == "Bar");
  }

  private static void AssertEqual(IMetric expected, MetricDocument? actual)
  {
    Assert.AreEqual(expected.Id, actual!.Id.ToString());
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.LastMeasurementDate, actual.LastMeasurementDate);
  }

  private static void AssertEqual(MetricDocument expected, IMetric actual)
  {
    Assert.AreEqual(expected.Id.ToString(), actual!.Id);
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.LastMeasurementDate, actual.LastMeasurementDate);
  }
}
