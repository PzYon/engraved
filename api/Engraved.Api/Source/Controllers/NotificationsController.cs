using Engraved.Core.Application;
using Engraved.Core.Application.CurrentUser;
using Engraved.Core.Domain.Notifications;
using Engraved.Core.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController(
  ICurrentUserService currentUserService,
  INotificationService notificationService
)
  : ControllerBase
{
  [HttpPost]
  [Route("send_test")]
  public async Task SendNotification()
  {
    IUser user = await currentUserService.LoadUser();
    await SendNotificationToUser(user.GlobalUniqueId);
  }

  private async Task SendNotificationToUser(Guid? uniqueUserId)
  {
    await notificationService.SendNotification(
      new ClientNotification
      {
        UserId = uniqueUserId?.ToString(),
        Title = "Test message (Title)",
        Message = "Sent from engraved OneSignal (Message)."
      },
      // short constant instead of a real entity id: a GUID here would push the
      // OneSignal collapse_id ("<entityId>::<userId>") over its 64-byte limit
      "test",
      false
    );
  }
}
