using Engraved.Core.Application;
using Engraved.Core.Application.Commands.Entries.Delete;
using Engraved.Core.Application.Commands.Entries.Move;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Commands.Entries.Upsert.Timer;
using Engraved.Core.Application.Queries.Entries.GetActive;
using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Domain.Entries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/entries")]
[Authorize]
public class EntriesController : ControllerBase
{
  private readonly Dispatcher _dispatcher;

  public EntriesController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [HttpGet]
  [Route("{journalId}")]
  public async Task<object[]> GetAll(string journalId, DateTime? fromDate, DateTime? toDate, string? attributeValues)
  {
    var query = new GetAllJournalEntriesQuery
    {
      JournalId = journalId,
      FromDate = fromDate,
      ToDate = toDate,
      AttributeValues = AttributeValueParser.Parse(attributeValues)
    };

    IEntry[] entries = await _dispatcher.Query<IEntry[], GetAllJournalEntriesQuery>(query);

    return entries.EnsurePolymorphismWhenSerializing();
  }

  [HttpGet]
  public async Task<GetAllEntriesQueryApiResult> GetAll(string? searchText, string? journalTypes)
  {
    var query = new GetAllEntriesQuery
    {
      SearchText = searchText,
      JournalTypes = ControllerUtils.ParseJournalTypes(journalTypes)
    };

    var result = await _dispatcher.Query<GetAllEntriesQueryResult, GetAllEntriesQuery>(query);
    return GetAllEntriesQueryApiResult.FromResult(result);
  }

  [HttpGet]
  [Route("{journalId}/active")]
  public async Task<IEntry?> GetActive(string journalId)
  {
    return await _dispatcher.Query<IEntry?, GetActiveEntryQuery>(new GetActiveEntryQuery { JournalId = journalId });
  }

  [HttpPost]
  [Route("counter")]
  public async Task UpsertCounter([FromBody] UpsertCounterEntryCommand entry)
  {
    await _dispatcher.Command(entry);
  }

  [HttpPost]
  [Route("gauge")]
  public async Task UpsertGauge([FromBody] UpsertGaugeEntryCommand entry)
  {
    await _dispatcher.Command(entry);
  }

  [HttpPost]
  [Route("scraps")]
  public async Task UpsertScraps([FromBody] UpsertScrapsEntryCommand entry)
  {
    await _dispatcher.Command(entry);
  }

  [HttpPost]
  [Route("timer")]
  public async Task StartTimer([FromBody] UpsertTimerEntryCommand entry)
  {
    await _dispatcher.Command(entry);
  }

  [HttpDelete]
  [Route("{entryId}")]
  public async Task Delete(string entryId)
  {
    await _dispatcher.Command(new DeleteEntryCommand { Id = entryId });
  }

  [HttpPut]
  [Route("{entryId}/move/{targetJournalId}")]
  public async Task MoveEntryToJournal(string entryId, string targetJournalId)
  {
    var command = new MoveEntryCommand
    {
      EntryId = entryId,
      TargetJournalId = targetJournalId
    };

    await _dispatcher.Command(command);
  }
}

// we need this class in order to support polymorphism for serialization.
// the important thing here is to use object.
public class GetAllEntriesQueryApiResult
{
  public object[] Journals { get; set; } = null!;
  public object[] Entries { get; set; } = null!;

  public static GetAllEntriesQueryApiResult FromResult(GetAllEntriesQueryResult result)
  {
    return new GetAllEntriesQueryApiResult
    {
      Entries = result.Entries,
      Journals = result.Journals
    };
  }
}
