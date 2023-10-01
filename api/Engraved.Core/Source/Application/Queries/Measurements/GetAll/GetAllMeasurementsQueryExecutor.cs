using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Queries.Measurements.GetAll;

public class GetAllMeasurementsQueryExecutor : IQueryExecutor<IMeasurement[]>
{
  public bool DisableCache => false;

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

    IJournal? metric = await repository.GetJournal(_query.MetricId);

    if (metric == null)
    {
      throw new InvalidQueryException<IMeasurement[]>(
        _query,
        $"Metric with key \"{_query.MetricId}\" does not exist."
      );
    }

    return await repository.GetAllMeasurements(
      _query.MetricId,
      _query.FromDate,
      _query.ToDate,
      _query.AttributeValues
    );
  }
}
