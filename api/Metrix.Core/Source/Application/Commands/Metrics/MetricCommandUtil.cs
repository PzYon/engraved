﻿using Metrix.Core.Application.Commands.Measurements.Add;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics;

public static class MetricCommandUtil
{
  public static async Task<TMetric> LoadAndValidateMetric<TMetric>(
    IRepository repository,
    ICommand command,
    string metricId
    )
    where TMetric : class, IMetric
  {
    if (string.IsNullOrEmpty(metricId))
    {
      throw new InvalidCommandException(
        command,
        $"A {nameof(BaseUpsertMeasurementCommand.MetricId)} must be specified."
      );
    }

    IMetric? metric = await repository.GetMetric(metricId);

    if (metric is not TMetric specificMetric)
    {
      throw new InvalidCommandException(command, $"A metric with key \"{metricId}\" does not exist.");
    }

    return specificMetric;
  }
}
