using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.AddSchedule;
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
public class EntriesController(Dispatcher dispatcher) : ControllerBase
{
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

    IEntry[] entries = await dispatcher.Query<IEntry[], GetAllJournalEntriesQuery>(query);

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

    GetAllEntriesQueryResult result = await dispatcher.Query<GetAllEntriesQueryResult, GetAllEntriesQuery>(query);
    return GetAllEntriesQueryApiResult.FromResult(result);
  }

  [HttpGet]
  [Route("{journalId}/active")]
  public async Task<IEntry?> GetActive(string journalId)
  {
    return await dispatcher.Query<IEntry?, GetActiveEntryQuery>(new GetActiveEntryQuery { JournalId = journalId });
  }

  [HttpPost]
  [Route("counter")]
  public async Task<CommandResult> UpsertCounter([FromBody] UpsertCounterEntryCommand command)
  {
    return await dispatcher.Command(command);
  }

  [HttpPost]
  [Route("gauge")]
  public async Task<CommandResult> UpsertGauge([FromBody] UpsertGaugeEntryCommand command)
  {
    return await dispatcher.Command(command);
  }

  [HttpPost]
  [Route("scraps")]
  public async Task<CommandResult> UpsertScraps([FromBody] UpsertScrapsEntryCommand command)
  {
    CommandResult result = await dispatcher.Command(command);

    if (command.Schedule == null)
    {
      return result;
    }

    command.Schedule.EntryId = result.EntityId;
    command.Schedule.OnClickUrl = string.IsNullOrEmpty(command.Schedule.OnClickUrl)
      ? null
      : string.Format(command.Schedule.OnClickUrl, result.EntityId);

    await dispatcher.Command(command.Schedule);

    return result;
  }

  [HttpPost]
  [Route("timer")]
  public async Task<CommandResult> StartTimer([FromBody] UpsertTimerEntryCommand command)
  {
    return await dispatcher.Command(command);
  }

  [HttpPost]
  [Route("{entryId}/schedule")]
  public async Task<CommandResult> AddSchedule(string entryId, [FromBody] AddScheduleToEntryCommand command)
  {
    if (entryId != command.EntryId)
    {
      throw new InvalidCommandException(command, "EntryIds from URL and body do not match.");
    }

    return await dispatcher.Command(command);
  }

  [HttpDelete]
  [Route("{entryId}")]
  public async Task<CommandResult> Delete(string entryId)
  {
    return await dispatcher.Command(new DeleteEntryCommand { Id = entryId });
  }

  [HttpPut]
  [Route("{entryId}/move/{targetJournalId}")]
  public async Task<CommandResult> MoveEntryToJournal(string entryId, string targetJournalId)
  {
    var command = new MoveEntryCommand
    {
      EntryId = entryId,
      TargetJournalId = targetJournalId
    };

    return await dispatcher.Command(command);
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
      Entries = result.Entries.OfType<object>().ToArray(),
      Journals = result.Journals.OfType<object>().ToArray()
    };
  }
}
