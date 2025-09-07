using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Entries;

namespace Engraved.Core.Application.Queries.Export;

public class ExportedDataResult
{
  public List<ExportedJournal> ExportedJournals { get; set; } = [];
}

public class ExportedJournal
{
  public IJournal Journal { get; set; } = null!;
  public IEntry[] Entries { get; set; } = [];
}

public class ExportDataQueryExecutor(Dispatcher dispatcher) : IQueryExecutor<ExportedDataResult, ExportDataQuery>
{
  public bool DisableCache => true;

  public async Task<ExportedDataResult> Execute(ExportDataQuery query)
  {
    var exportedData = new ExportedDataResult();

    var journals = await dispatcher.Query<IJournal[], GetAllJournalsQuery>(new GetAllJournalsQuery());

    foreach (IJournal journal in journals)
    {
      var entriesQuery = new GetAllJournalEntriesQuery { JournalId = journal.Id };

      var entries = await dispatcher.Query<IEntry[], GetAllJournalEntriesQuery>(entriesQuery);

      exportedData.ExportedJournals.Add(
        new ExportedJournal
        {
          Journal = journal,
          Entries = entries
        }
      );
    }

    return exportedData;
  }
}
