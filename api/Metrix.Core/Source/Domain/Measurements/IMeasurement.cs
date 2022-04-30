namespace Metrix.Core.Domain.Measurements;

public interface IMeasurement
{
  string? Id { get; set; }

  string MetricKey { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  string? MetricFlagKey { get; set; }
}
