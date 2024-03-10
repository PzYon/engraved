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
  public void SendNotification()
  {
    SendNotificationToUser(currentUserService.GetUserName()!);
  }

  private User CreateOneSignalUser(string userName)
  {
    var appConfig = new Configuration
    {
      BasePath = "https://onesignal.com/api/v1",
      AccessToken = "N2NjZjA5YTMtNjkzOC00ZGJjLTkxNGYtZDg5MDEyNmI3OTE4"
    };

    var apiInstance = new DefaultApi(appConfig);
    var appId = "dc1847f6-a390-408e-9d6d-7b9868a78a11";
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

  private void SendNotificationToUser(string userName)
  {
    var appConfig = new Configuration
    {
      BasePath = "https://onesignal.com/api/v1",
      AccessToken = "N2NjZjA5YTMtNjkzOC00ZGJjLTkxNGYtZDg5MDEyNmI3OTE4"
    };

    var apiInstance = new DefaultApi(appConfig);
    var appId = "dc1847f6-a390-408e-9d6d-7b9868a78a11";

    var notification = new Notification(
      appId: appId,
      includeAliases: new PlayerNotificationTargetIncludeAliases
      {
        AliasLabel = [userName]
      },
      externalId: userName
    );

    try
    {
      // Create notification
      CreateNotificationSuccessResponse result = apiInstance.CreateNotification(notification);
      Debug.WriteLine(result);
    }
    catch (ApiException e)
    {
      Debug.Print("Exception when calling DefaultApi.CreateNotification: " + e.Message);
      Debug.Print("Status Code: " + e.ErrorCode);
      Debug.Print(e.StackTrace);
    }
  }
}
