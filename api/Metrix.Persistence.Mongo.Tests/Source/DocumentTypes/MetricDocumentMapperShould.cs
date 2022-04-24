using Metrix.Core.Domain.Metrics;
using Metrix.Persistence.Mongo.DocumentTypes.Metrics;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests.DocumentTypes;

public class MetricDocumentMapperShould
{
  [Test]
  public void Counter_ToDocument()
  {
    IMetricDocument baseMetricDocument = MetricDocumentMapper.ToDocument(new CounterMetric());
    Assert.IsTrue(baseMetricDocument is CounterMetricDocument);
  }

  [Test]
  public void Counter_FromDocument()
  {
    IMetric metric = MetricDocumentMapper.FromDocument<IMetric>(new CounterMetricDocument());
    Assert.IsTrue(metric is CounterMetric);
  }

  [Test]
  public void Gauge_ToDocument()
  {
    IMetricDocument baseMetricDocument = MetricDocumentMapper.ToDocument(new GaugeMetric());
    Assert.IsTrue(baseMetricDocument is GaugeMetricDocument);
  }

  [Test]
  public void Gauge_FromDocument()
  {
    IMetric metric = MetricDocumentMapper.FromDocument<IMetric>(new GaugeMetricDocument());
    Assert.IsTrue(metric is GaugeMetric);
  }

  [Test]
  public void Timer_ToDocument()
  {
    IMetricDocument baseMetricDocument = MetricDocumentMapper.ToDocument(new TimerMetric());
    Assert.IsTrue(baseMetricDocument is TimerMetricDocument);
  }

  [Test]
  public void Timer_FromDocument()
  {
    IMetric metric = MetricDocumentMapper.FromDocument<IMetric>(new TimerMetricDocument());
    Assert.IsTrue(metric is TimerMetric);
  }
}
