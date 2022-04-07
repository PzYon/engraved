using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQueryExecutor : IQueryExecutor<IMeasurement[]>
{
  private readonly GetAllMeasurementsQuery _query;

  public GetAllMeasurementsQueryExecutor(GetAllMeasurementsQuery query)
  {
    _query = query;
  }

  public IMeasurement[] Execute(IDb db)
  {
    Metric? metric = db.Metrics.FirstOrDefault(m => m.Key == _query.MetricKey);

    if (metric == null)
    {
      throw new Exception($"Metric with key \"{_query.MetricKey}\" does not exist.");
    }

    switch (metric.Type)
    {
      case MetricType.Counter:
        return GetMeasurements<CounterMeasurement>(db);
      case MetricType.Gauge:
        return GetMeasurements<GaugeMeasurement>(db);
      case MetricType.Timer:
        return GetMeasurements<TimerMeasurement>(db);
      default:
        throw new NotImplementedException($"Metric type \"{metric.Type}\" is not yet supported.");
    }
  }

  private T[] GetMeasurements<T>(IDb db) where T : IMeasurement
  {
    return db.Measurements
      .Where(m => m.MetricKey == _query.MetricKey)
      .OrderBy(m => m.DateTime)
      .OfType<T>()
      .ToArray();
  }
}
