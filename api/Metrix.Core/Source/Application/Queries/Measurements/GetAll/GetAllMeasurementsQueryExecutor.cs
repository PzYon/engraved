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

  public async Task<IMeasurement[]> Execute(IDb db)
  {
    if (string.IsNullOrEmpty(_query.MetricKey))
    {
      throw new Exception($"{nameof(GetAllMeasurementsQuery.MetricKey)} must be specified.");
    }

    IMetric? metric = await db.GetMetric(_query.MetricKey);

    if (metric == null)
    {
      throw new Exception($"Metric with key \"{_query.MetricKey}\" does not exist.");
    }

    IMeasurement[] allMeasurements = await db.GetAllMeasurements(_query.MetricKey);

    return allMeasurements
      .OrderBy(m => m.DateTime)
      .ToArray();
  }
}
