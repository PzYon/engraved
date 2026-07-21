using Engraved.Api.Admin;
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
public class AdminController(
  Dispatcher dispatcher,
  Lazy<IUser> currentUser,
  DeleteUserConfirmationStore deleteUserConfirmationStore
) : ControllerBase
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

  // First step of the delete flow: proves the caller is an admin and hands back a short-lived,
  // single-use token that DeleteUser then requires - see DeleteUserConfirmationStore.
  [HttpPost]
  [Route("users/{userId}/delete-confirmation")]
  public DeleteUserConfirmationResult RequestDeleteConfirmation(string userId)
  {
    EnsureIsAdmin();

    return new DeleteUserConfirmationResult { ConfirmationToken = deleteUserConfirmationStore.IssueToken(userId) };
  }

  [HttpDelete]
  [Route("users/{userId}")]
  public async Task<CommandResult> DeleteUser(string userId, [FromBody] DeleteUserRequest request)
  {
    EnsureIsAdmin();

    var command = new DeleteUserCommand { UserId = userId };

    if (userId != request.UserId)
    {
      throw new InvalidCommandException(command, "UserIds from URL and body do not match.");
    }

    if (!deleteUserConfirmationStore.TryConsumeToken(userId, request.ConfirmationToken))
    {
      throw new NotAllowedOperationException("Delete was not confirmed.");
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
