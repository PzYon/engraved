using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics;

public static class MetricUtil
{
  public static TMetric LoadAndValidateMetric<TMetric>(IDb db, ICommand command, string metricKey)
    where TMetric : IMetric
  {
    if (string.IsNullOrEmpty(metricKey))
    {
      throw new InvalidCommandException(command, $"A {nameof(BaseAddMeasurementCommand.MetricKey)} must be specified.");
    }

    TMetric? metric = db.Metrics.OfType<TMetric>().FirstOrDefault(m => m.Key == metricKey);

    if (metric == null)
    {
      throw new InvalidCommandException(command, $"A metric with key \"{metricKey}\" does not exist.");
    }

    return metric;
  }
}
