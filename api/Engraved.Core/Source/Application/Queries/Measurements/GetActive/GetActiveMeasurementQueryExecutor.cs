using Engraved.Core.Application.Commands.Measurements.Upsert.Timer;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Measurements.GetAll;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Queries.Measurements.GetActive;

public class GetActiveMeasurementQueryExecutor : IQueryExecutor<IMeasurement?>
{
  public bool DisableCache => false;

  private readonly GetActiveMeasurementQuery _query;

  public GetActiveMeasurementQueryExecutor(GetActiveMeasurementQuery query)
  {
    _query = query;
  }

  public async Task<IMeasurement?> Execute(IRepository repository)
  {
    if (string.IsNullOrEmpty(_query.MetricId))
    {
      throw new InvalidQueryException<IMeasurement?>(
        _query,
        $"{nameof(GetAllMeasurementsQuery.MetricId)} must be specified."
      );
    }

    IMetric? metric = await repository.GetMetric(_query.MetricId);

    if (metric == null)
    {
      throw new InvalidQueryException<IMeasurement?>(
        _query,
        $"Metric with key \"{_query.MetricId}\" does not exist."
      );
    }

    if (metric.Type != MetricType.Timer)
    {
      return null;
    }

    var timerMetric = (TimerMetric)metric;
    return await UpsertTimerMeasurementCommandExecutor.GetActiveMeasurement(repository, timerMetric);
  }
}
