using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Queries.Search.Measurements;

public class SearchMeasurementsQuery : IQuery<IMeasurement[]>
{
  public string SearchText { get; set; } = null!;

  public IQueryExecutor<IMeasurement[]> CreateExecutor() => new SearchMeasurementsQueryExecutor(this);
}
