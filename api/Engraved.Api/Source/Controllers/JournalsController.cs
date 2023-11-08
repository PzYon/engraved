using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Journals.Delete;
using Engraved.Core.Application.Commands.Journals.Edit;
using Engraved.Core.Application.Commands.Journals.EditPermissions;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Application.Queries.Journals.GetThresholdValues;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/journals")]
[Authorize]
public class JournalsController : ControllerBase
{
  private readonly Dispatcher _dispatcher;

  public JournalsController(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  [HttpGet]
  public async Task<object[]> GetAll(string? searchText, string? journalTypes, bool? favoritesOnly)
  {
    var query = new GetAllJournalsQuery
    {
      SearchText = searchText,
      JournalTypes = ControllerUtils.ParseJournalTypes(journalTypes),
      FavoritesOnly = favoritesOnly
    };

    IJournal[] journals = await _dispatcher.Query<IJournal[], GetAllJournalsQuery>(query);
    return journals.EnsurePolymorphismWhenSerializing();
  }

  [Route("{journalId}")]
  [HttpGet]
  public async Task<IJournal?> Get(string journalId)
  {
    return await _dispatcher.Query<IJournal?, GetJournalQuery>(new GetJournalQuery { JournalId = journalId });
  }

  [HttpPost]
  public async Task<CommandResult> Add([FromBody] AddJournalCommand command)
  {
    return await _dispatcher.Command(command);
  }

  [HttpPut]
  public async Task<CommandResult> Edit([FromBody] EditJournalCommand command)
  {
    return await _dispatcher.Command(command);
  }

  [Route("{journalId}/permissions")]
  [HttpPut]
  public async Task<CommandResult> Permissions(
    [FromBody] Dictionary<string, PermissionKind> permissions,
    string journalId
  )
  {
    var command = new EditJournalPermissionsCommand
    {
      JournalId = journalId,
      Permissions = permissions
    };

    return await _dispatcher.Command(command);
  }

  [Route("{journalId}/threshold_values")]
  [HttpGet]
  public async Task<IDictionary<string, IDictionary<string, ThresholdResult>>> GetThresholdValues(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate
  )
  {
    var query = new GetThresholdValuesQuery
    {
      JournalId = journalId,
      FromDate = fromDate,
      ToDate = toDate
    };

    return await _dispatcher.Query<IDictionary<string, IDictionary<string, ThresholdResult>>, GetThresholdValuesQuery>(
      query
    );
  }

  [HttpDelete]
  [Route("{journalId}")]
  public async Task<CommandResult> Delete(string journalId)
  {
   return await _dispatcher.Command(new DeleteJournalCommand { JournalId = journalId });
  }
}
