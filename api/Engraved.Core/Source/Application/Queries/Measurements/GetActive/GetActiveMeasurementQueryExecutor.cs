using Engraved.Core.Application.Commands.Measurements.Upsert.Timer;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Measurements.GetAll;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

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
    if (string.IsNullOrEmpty(_query.JournalId))
    {
      throw new InvalidQueryException<IMeasurement?>(
        _query,
        $"{nameof(GetAllMeasurementsQuery.JournalId)} must be specified."
      );
    }

    IJournal? journal = await repository.GetJournal(_query.JournalId);

    if (journal == null)
    {
      throw new InvalidQueryException<IMeasurement?>(
        _query,
        $"Journal with key \"{_query.JournalId}\" does not exist."
      );
    }

    if (journal.Type != JournalType.Timer)
    {
      return null;
    }

    var timerJournal = (TimerJournal)journal;
    return await UpsertTimerMeasurementCommandExecutor.GetActiveMeasurement(repository, timerJournal);
  }
}
