using Engraved.Core.Application;
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
    SendNotificationToUser(user.GlobalUniqueId);
  }

  private void SendNotificationToUser(Guid? uniqueUserId)
  {
    notificationService.SendNotification(
      new ClientNotification
      {
        UserId = uniqueUserId?.ToString(),
        Title = "Test message (Title)",
        Message = "Sent from engraved OneSignal (Message)."
      },
      false
    );
  }
}
