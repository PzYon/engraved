using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Queries.Search.Measurements;

public class SearchMeasurementsQueryExecutor : IQueryExecutor<IMeasurement[]>
{
  private readonly SearchMeasurementsQuery _query;

  public bool DisableCache => true;

  public SearchMeasurementsQueryExecutor(SearchMeasurementsQuery query)
  {
    _query = query;
  }

  public async Task<IMeasurement[]> Execute(IRepository repository)
  {
    return await repository.SearchMeasurements(_query.SearchText);
  }
}
