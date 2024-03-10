using Engraved.Api.Notifications;
using Engraved.Core.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using OneSignalApi.Api;
using OneSignalApi.Client;
using OneSignalApi.Model;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController(
  ICurrentUserService currentUserService,
  ILogger<NotificationsController> logger,
  IOptions<NotificationsConfig> notificationsConfig
)
  : ControllerBase
{
  [HttpGet]
  [Route("send")]
  public CreateNotificationSuccessResponse SendNotification()
  {
    return SendNotificationToUser(currentUserService.GetUserName()!);
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

  private CreateNotificationSuccessResponse SendNotificationToUser(string userName)
  {
    DefaultApi apiInstance = GetApiInstance();

    var notification = new Notification(
      appId: notificationsConfig.Value.AppId,
      targetChannel: Notification.TargetChannelEnum.Push,
      includeExternalUserIds: ["8c19c1e5-a319-4705-8cc0-b9ef627d1f70"],
      contents: new StringMap(en: "Sali Walter")
    );

    try
    {
      // Create notification
      return apiInstance.CreateNotification(notification);
    }
    catch (ApiException e)
    {
      logger.LogInformation("Exception when calling DefaultApi.CreateNotification: " + e.Message);
      logger.LogInformation("Status Code: " + e.ErrorCode);
      logger.LogInformation(e.StackTrace);

      throw e;
    }
  }
}
