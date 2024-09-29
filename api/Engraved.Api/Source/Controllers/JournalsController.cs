using Amazon.Runtime.Internal;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Journals.AddSchedule;
using Engraved.Core.Application.Commands.Journals.Delete;
using Engraved.Core.Application.Commands.Journals.Edit;
using Engraved.Core.Application.Commands.Journals.EditPermissions;
using Engraved.Core.Application.Commands.Journals.UpdateTags;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/journals")]
[Authorize]
public class JournalsController(Dispatcher dispatcher) : ControllerBase
{
  [HttpGet]
  public async Task<object[]> GetAll(string? searchText, string? journalTypes, bool? favoritesOnly, string? journalIds)
  {
    var query = new GetAllJournalsQuery
    {
      SearchText = searchText,
      JournalTypes = ControllerUtils.ParseJournalTypes(journalTypes),
      FavoritesOnly = favoritesOnly,
      JournalIds = ControllerUtils.ParseMultiValueStringParam(journalIds)
    };

    var journals = await dispatcher.Query<IJournal[], GetAllJournalsQuery>(query);
    return journals.EnsurePolymorphismWhenSerializing();
  }

  [Route("{journalId}")]
  [HttpGet]
  public async Task<IJournal?> Get(string journalId)
  {
    return await dispatcher.Query<IJournal?, GetJournalQuery>(new GetJournalQuery { JournalId = journalId });
  }

  [HttpPost]
  public async Task<CommandResult> Add([FromBody] AddJournalCommand command)
  {
    return await dispatcher.Command(command);
  }

  [HttpPut]
  public async Task<CommandResult> Edit([FromBody] EditJournalCommand command)
  {
    return await dispatcher.Command(command);
  }

  [HttpPost]
  [Route("{journalId}/schedule")]
  public async Task<CommandResult> AddSchedule(string journalId, [FromBody] AddScheduleToJournalCommand command)
  {
    if (journalId != command.JournalId)
    {
      throw new InvalidCommandException(command, "JournalIds from URL and body do not match.");
    }

    return await dispatcher.Command(command);
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

    return await dispatcher.Command(command);
  }

  [HttpDelete]
  [Route("{journalId}")]
  public async Task<CommandResult> Delete(string journalId)
  {
    return await dispatcher.Command(new DeleteJournalCommand { JournalId = journalId });
  }

  [HttpPatch]
  [Route("{journalId}/tags")]
  public async Task<CommandResult> UpdateUserTags(string journalId, UpdateJournalUserTagsCommand command)
  {
    command.JournalId = journalId;
    
    return await dispatcher.Command(command);
  }
}
