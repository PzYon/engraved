using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Journals.UpdateTags;
using Engraved.Core.Application.Commands.Users.AddJournalToFavorites;
using Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;
using Engraved.Core.Application.Commands.Users.UpdateTags;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController(IUserScopedRepository userScopedRepository, Dispatcher dispatcher)
  : Controller
{
  [HttpGet]
  public IUser GetCurrentUser()
  {
    return userScopedRepository.CurrentUser.Value;
  }

  [HttpPatch]
  [Route("tags")]
  public async Task<CommandResult> UpdateTags(UpdateJournalUserTagsCommand command)
  {
    return await dispatcher.Command(command);
  }

  [HttpPatch]
  [Route("favorites/{journalId}")]
  public async Task<CommandResult> AddJournalToFavorites(string journalId)
  {
    var command = new AddJournalToFavoritesCommand
    {
      JournalId = journalId
    };

    return await dispatcher.Command(command);
  }

  [HttpDelete]
  [Route("favorites/{journalId}")]
  public async Task<CommandResult> RemoveJournalFromFavorites(string journalId)
  {
    var command = new RemoveJournalFromFavoritesCommand
    {
      JournalId = journalId
    };

    return await dispatcher.Command(command);
  }
}
