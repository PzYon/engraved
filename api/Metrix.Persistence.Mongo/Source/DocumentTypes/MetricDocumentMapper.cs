using Metrix.Core.Domain.Metrics;

namespace Metrix.Persistence.Mongo.DocumentTypes;

public static class MetricDocumentMapper
{
  public static BaseMetricDocument ToDocument(IMetric metric)
  {
    BaseMetricDocument document;

    switch (metric.Type)
    {
      case MetricType.Counter:
        document = new CounterMetricDocument();
        break;
      case MetricType.Gauge:
        document = new GaugeMetricDocument();
        break;
      case MetricType.Timer:
        document = new TimerMetricDocument
        {
          StartDate = (metric as TimerMetric)?.StartDate
        };
        break;
      default:
        throw new ArgumentOutOfRangeException();
    }

    document.Key = metric.Key;
    document.Name = metric.Name;
    document.Description = metric.Description;
    document.Flags = metric.Flags;
    document.LastMeasurementDate = metric.LastMeasurementDate;

    return document;
  }

  public static IMetric FromDocument(BaseMetricDocument document)
  {
    BaseMetric metric;

    switch (document.Type)
    {
      case MetricType.Counter:
        metric = new CounterMetric();
        break;
      case MetricType.Gauge:
        metric = new GaugeMetric();
        break;
      case MetricType.Timer:
        metric = new TimerMetric
        {
          StartDate = (document as TimerMetricDocument)?.StartDate
        };
        break;
      default:
        throw new ArgumentOutOfRangeException();
    }

    metric.Description = document.Description;
    metric.Flags = document.Flags;
    metric.Key = document.Key;
    metric.LastMeasurementDate = document.LastMeasurementDate;

    return metric;
  }
}
