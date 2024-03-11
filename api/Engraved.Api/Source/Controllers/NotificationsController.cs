using Engraved.Api.Notifications;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OneSignalApi.Api;
using OneSignalApi.Client;
using OneSignalApi.Model;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController(
  ICurrentUserService currentUserService,
  IOptions<NotificationsConfig> notificationsConfig
)
  : ControllerBase
{
  [HttpPost]
  [Route("send_test")]
  public async Task<CreateNotificationSuccessResponse> SendNotification()
  {
    IUser user = await currentUserService.LoadUser();
    return SendNotificationToUser(user.GlobalUniqueId);
  }

  private CreateNotificationSuccessResponse SendNotificationToUser(Guid? uniqueUserId)
  {
    if (string.IsNullOrEmpty(notificationsConfig.Value.AppId))
    {
      throw new ArgumentException(
        $"\"{nameof(NotificationsConfig.AppId)}\" is not set, please do so in your environment settings."
      );
    }
    
    if (string.IsNullOrEmpty(notificationsConfig.Value.AppSecret))
    {
      throw new ArgumentException(
        $"\"{nameof(NotificationsConfig.AppSecret)}\" is not set, please do so in your environment settings."
      );
    }
    
    if (!uniqueUserId.HasValue)
    {
      throw new NotAllowedOperationException(
        $"Cannot send OneSignal message, as ${nameof(IUser.GlobalUniqueId)} is not available."
      );
    }

    var notification = new Notification(
      appId: notificationsConfig.Value.AppId,
      targetChannel: Notification.TargetChannelEnum.Push,
      includeExternalUserIds: [uniqueUserId.ToString()],
      contents: new StringMap(en: "Test from engraved OneSignal.")
    );

    return GetApiInstance().CreateNotification(notification);
  }

  private DefaultApi GetApiInstance()
  {
    return new DefaultApi(
      new Configuration
      {
        BasePath = "https://onesignal.com/api/v1",
        AccessToken = notificationsConfig.Value.AppSecret
      }
    );
  }
}
