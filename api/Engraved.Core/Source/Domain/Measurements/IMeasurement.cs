namespace Engraved.Core.Domain.Measurements;

public interface IMeasurement : IUserScoped, IEditable
{
  string? Id { get; set; }

  string MetricId { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  Dictionary<string, string[]> MetricAttributeValues { get; set; }

  double GetValue();
}
