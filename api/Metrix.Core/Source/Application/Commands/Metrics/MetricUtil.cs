using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics;

public static class MetricUtil
{
  public static async Task<TMetric> LoadAndValidateMetric<TMetric>(IRepository repository, ICommand command, string metricKey)
    where TMetric : class, IMetric
  {
    if (string.IsNullOrEmpty(metricKey))
    {
      throw new InvalidCommandException(command, $"A {nameof(BaseUpsertMeasurementCommand.MetricKey)} must be specified.");
    }

    IMetric? metric = await repository.GetMetric(metricKey);

    if (metric is not TMetric specificMetric)
    {
      throw new InvalidCommandException(command, $"A metric with key \"{metricKey}\" does not exist.");
    }

    return specificMetric;
  }
}
