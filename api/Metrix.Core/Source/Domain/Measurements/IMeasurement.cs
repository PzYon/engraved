namespace Metrix.Core.Domain.Measurements;

public interface IMeasurement : IUserScoped
{
  string? Id { get; set; }

  string MetricId { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  Dictionary<string, string[]> MetricAttributeValues { get; set; }

  double GetValue();
}
