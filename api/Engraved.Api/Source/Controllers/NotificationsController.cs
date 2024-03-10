using System.Diagnostics;
using Engraved.Core.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OneSignalApi.Api;
using OneSignalApi.Client;
using OneSignalApi.Model;

namespace Engraved.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController(ICurrentUserService currentUserService, ILogger<NotificationsController> logger)
  : ControllerBase
{
  [HttpGet]
  [Route("user")]
  public User RegisterUser()
  {
    return CreateOneSignalUser(currentUserService.GetUserName()!);
  }

  [HttpGet]
  [Route("send")]
  public CreateNotificationSuccessResponse SendNotification()
  {
    return SendNotificationToUser(currentUserService.GetUserName()!);
  }

  private User CreateOneSignalUser(string userName)
  {
    DefaultApi apiInstance = GetApiInstance();

    var appId = "94153697-bc1b-49de-b187-80e4e6832920";
    
    var user = new User(new PropertiesObject(), new Dictionary<string, object>(), new List<SubscriptionObject>());
    user.Identity.Add("userName", userName);
    user.Identity.Add("external_id", userName);

    try
    {
      User result = apiInstance.CreateUser(appId, user);
      logger.LogInformation(JsonConvert.SerializeObject(result));

      InlineResponse201 subscription = apiInstance.CreateSubscription(
        appId,
        userName,
        result.Identity["onesignal_id"] as string,
        new CreateSubscriptionRequestBody()
      );

      return result;
    }
    catch (ApiException e)
    {
      logger.LogInformation("Exception when calling DefaultApi.CreateUser: " + e.Message);
      logger.LogInformation("Status Code: " + e.ErrorCode);
      logger.LogInformation(e.StackTrace);
      throw e;
    }
  }

  private static DefaultApi GetApiInstance()
  {
    var apiInstance = new DefaultApi(
      new Configuration
      {
        BasePath = "https://onesignal.com/api/v1",
        AccessToken = "YzQ2MzIzMzgtNmJhNS00Y2FjLTk2Y2MtMDZiYWFmYjIwYTg2"
      }
    );
    return apiInstance;
  }

  private CreateNotificationSuccessResponse SendNotificationToUser(string userName)
  {
    DefaultApi apiInstance = GetApiInstance();

    var appId = "94153697-bc1b-49de-b187-80e4e6832920";

    var notification = new Notification(
      appId: appId,
      includeAliases: new PlayerNotificationTargetIncludeAliases
      {
        AliasLabel = ["user_name"],
      },
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
