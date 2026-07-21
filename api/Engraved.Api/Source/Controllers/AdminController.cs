using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Users.Delete;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Users.GetAdminOverview;
using Engraved.Core.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController(Dispatcher dispatcher, Lazy<IUser> currentUser) : ControllerBase
{
  [HttpGet]
  [Route("users")]
  public async Task<AdminUserOverview[]> GetUsers()
  {
    EnsureIsAdmin();

    return await dispatcher.Query<AdminUserOverview[], GetAdminUsersOverviewQuery>(
      new GetAdminUsersOverviewQuery()
    );
  }

  [HttpDelete]
  [Route("users/{userId}")]
  public async Task<CommandResult> DeleteUser(string userId, [FromBody] DeleteUserCommand command)
  {
    EnsureIsAdmin();

    if (userId != command.UserId)
    {
      throw new InvalidCommandException(command, "UserIds from URL and body do not match.");
    }

    return await dispatcher.Command(command);
  }

  private void EnsureIsAdmin()
  {
    if (!currentUser.Value.IsAdmin)
    {
      throw new NotAllowedOperationException("You are not allowed to access admin features.");
    }
  }
}
