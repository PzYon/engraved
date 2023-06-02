using Engraved.Core.Domain.Metrics;

namespace Engraved.Api.Controllers;

public static class ControllerUtils
{
  public static MetricType[]? ParseMetricTypes(string? metricTypes)
  {
    if (string.IsNullOrEmpty(metricTypes))
    {
      return null;
    }

    return metricTypes.Split(",")
      .Select(Enum.Parse<MetricType>)
      .ToArray();
  }
}
