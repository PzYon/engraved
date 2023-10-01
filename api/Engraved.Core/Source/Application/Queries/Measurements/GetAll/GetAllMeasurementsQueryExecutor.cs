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
    if (string.IsNullOrEmpty(_query.JournalId))
    {
      throw new InvalidQueryException<IMeasurement[]>(
        _query,
        $"{nameof(GetAllMeasurementsQuery.JournalId)} must be specified."
      );
    }

    IJournal? journal = await repository.GetJournal(_query.JournalId);

    if (journal == null)
    {
      throw new InvalidQueryException<IMeasurement[]>(
        _query,
        $"Journal with key \"{_query.JournalId}\" does not exist."
      );
    }

    return await repository.GetAllMeasurements(
      _query.JournalId,
      _query.FromDate,
      _query.ToDate,
      _query.AttributeValues
    );
  }
}
