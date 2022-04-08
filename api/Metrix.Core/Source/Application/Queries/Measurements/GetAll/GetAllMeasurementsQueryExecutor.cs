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
    if (string.IsNullOrEmpty(_query.MetricKey))
    {
      throw new Exception($"{nameof(GetAllMeasurementsQuery.MetricKey)} must be specified.");
    }

    IMetric? metric = db.Metrics.FirstOrDefault(m => m.Key == _query.MetricKey);

    if (metric == null)
    {
      throw new Exception($"Metric with key \"{_query.MetricKey}\" does not exist.");
    }

    return db.Measurements
      .Where(m => m.MetricKey == _query.MetricKey)
      .OrderBy(m => m.DateTime)
      .ToArray();
  }
}
