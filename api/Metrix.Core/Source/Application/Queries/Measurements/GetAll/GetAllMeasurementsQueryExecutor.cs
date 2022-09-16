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

  public async Task<IMeasurement[]> Execute(IRepository repository)
  {
    if (string.IsNullOrEmpty(_query.MetricId))
    {
      throw new InvalidQueryException<IMeasurement[]>(
        _query,
        $"{nameof(GetAllMeasurementsQuery.MetricId)} must be specified."
      );
    }

    IMetric? metric = await repository.GetMetric(_query.MetricId);

    if (metric == null)
    {
      throw new InvalidQueryException<IMeasurement[]>(
        _query,
        $"Metric with key \"{_query.MetricId}\" does not exist."
      );
    }

    IMeasurement[] allMeasurements = await repository.GetAllMeasurements(
      _query.MetricId,
      _query.FromDate,
      _query.ToDate,
      _query.AttributeValues
    );

    // consider: moving OrderByDescending logic to DB
    return allMeasurements
      .OrderByDescending(m => m.DateTime)
      .ToArray();
  }
}
