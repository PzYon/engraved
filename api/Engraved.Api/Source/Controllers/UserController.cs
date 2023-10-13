using Engraved.Core.Application;
using Engraved.Core.Application.Commands.Users.AddJournalToFavorites;
using Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/user")]
[Authorize]
public class UserController : Controller
{
  private readonly IUserScopedRepository _userScopedRepository;
  private readonly Dispatcher _dispatcher;

  public UserController(IUserScopedRepository userScopedRepository, Dispatcher dispatcher)
  {
    _userScopedRepository = userScopedRepository;
    _dispatcher = dispatcher;
  }

  [HttpGet]
  public IUser GetCurrentUser()
  {
    return _userScopedRepository.CurrentUser.Value;
  }

  [HttpPatch] // or PUT?
  [Route("favorites/{journalId}")]
  public async Task AddJournalToFavorites(string journalId)
  {
    var command = new AddJournalToFavoritesCommand
    {
      JournalId = journalId,
    };

    await _dispatcher.Command(command);
  }

  [HttpDelete]
  [Route("favorites/{journalId}")]
  public async Task RemoveJournalFromFavorites(string journalId)
  {
    var command = new RemoveJournalFromFavoritesCommand
    {
      JournalId = journalId,
    };

    await _dispatcher.Command(command);
  }
}
