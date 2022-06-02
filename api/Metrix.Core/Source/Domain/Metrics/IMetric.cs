namespace Metrix.Core.Domain.Metrics;

public interface IMetric : IUserScoped
{
  string? Id { get; set; }

  string Name { get; set; }

  string? Description { get; set; }

  MetricType Type { get; }

  Dictionary<string, MetricAttribute> Attributes { get; set; }

  DateTime? LastMeasurementDate { get; set; }
}
