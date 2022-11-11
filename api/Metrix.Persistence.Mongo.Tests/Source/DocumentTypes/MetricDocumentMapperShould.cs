using System;
using System.Collections.Generic;
using Metrix.Core.Domain.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using MongoDB.Bson;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests.DocumentTypes;

public class MetricDocumentMapperShould
{
  private static readonly string Id = MongoUtil.GenerateNewIdAsString();
  private static readonly string Name = "N@me";
  private static readonly string Description = "D3scription";
  private static readonly string Notes = "N0t3s";

  [Test]
  public void Counter_ToDocument()
  {
    var counterMetric = new CounterMetric
    {
      Id = Id,
      Name = Name,
      Description = Description,
      Notes = Notes,
      EditedOn = DateTime.UtcNow
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
      Notes = Notes,
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
      Description = Description,
      Notes = Notes
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
      Name = Name,
      Notes = Notes
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
      Notes = Notes,
      Attributes = new Dictionary<string, MetricAttribute>
      {
        {
          "flags", new MetricAttribute
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

    Assert.Contains("flags", metricDocument.Attributes.Keys);
    MetricAttribute attribute = metricDocument.Attributes["flags"];
    Assert.AreEqual("Flags", attribute.Name);
    Assert.Contains("fl@g", attribute.Values.Keys);
    Assert.AreEqual("fl@g_value", attribute.Values["fl@g"]);
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
      Notes = Notes,
      StartDate = startDate
    };

    var metric = MetricDocumentMapper.FromDocument<IMetric>(timerMetricDocument);

    var timerMetric = (TimerMetric) metric;
    Assert.IsNotNull(timerMetric);
    Assert.AreEqual(MetricType.Timer, metric.Type);
    Assert.AreEqual(startDate, timerMetric.StartDate);
    AssertEqual(timerMetricDocument, metric);
  }

  [Test]
  public void Counter_Attributes()
  {
    var metric = new CounterMetric
    {
      Id = Id,
      Description = Description,
      Name = Name,
      Notes = Notes,
      Attributes = new Dictionary<string, MetricAttribute>
      {
        {
          "values",
          new MetricAttribute
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

    Assert.IsNotNull(document.Attributes);
    Assert.AreEqual(1, document.Attributes.Count);
    Assert.IsTrue(document.Attributes.ContainsKey("values"));

    MetricAttribute attribute = document.Attributes["values"];

    Assert.AreEqual(2, attribute.Values.Count);
    Assert.IsTrue(attribute.Values.ContainsKey("foo"));
    Assert.IsTrue(attribute.Values["foo"] == "Foo");
    Assert.IsTrue(attribute.Values.ContainsKey("bar"));
    Assert.IsTrue(attribute.Values["bar"] == "Bar");
  }

  private static void AssertEqual(IMetric expected, MetricDocument? actual)
  {
    Assert.AreEqual(expected.Id, actual!.Id.ToString());
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.EditedOn, actual.EditedOn);
  }

  private static void AssertEqual(MetricDocument expected, IMetric actual)
  {
    Assert.AreEqual(expected.Id.ToString(), actual.Id);
    Assert.AreEqual(expected.Name, actual.Name);
    Assert.AreEqual(expected.Type, actual.Type);
    Assert.AreEqual(expected.Description, actual.Description);
    Assert.AreEqual(expected.Notes, actual.Notes);
    Assert.AreEqual(expected.EditedOn, actual.EditedOn);
  }
}
