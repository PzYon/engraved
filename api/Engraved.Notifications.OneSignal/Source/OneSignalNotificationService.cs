using System.Runtime.Serialization;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Notifications;
using Microsoft.Extensions.Options;
using OneSignalApi.Api;
using OneSignalApi.Client;
using OneSignalApi.Model;

namespace Engraved.Notifications.OneSignal;

public class OneSignalNotificationService(IOptions<OneSignalConfig> config) : INotificationService
{
  public async Task<string?> SendNotification(ClientNotification clientNotification, bool doNotSend)
  {
    if (string.IsNullOrEmpty(config.Value.AppId))
    {
      throw new ArgumentException(
        $"\"{nameof(config.Value.AppId)}\" is not set, please do so in your environment settings."
      );
    }

    if (string.IsNullOrEmpty(config.Value.AppSecret))
    {
      throw new ArgumentException(
        $"\"{nameof(config.Value.AppSecret)}\" is not set, please do so in your environment settings."
      );
    }

    if (string.IsNullOrEmpty(clientNotification.UserId))
    {
      throw new NotAllowedOperationException(
        $"Cannot send OneSignal message, as ${nameof(ClientNotification.UserId)} is not available."
      );
    }

    // valid resources:
    // https://github.com/OneSignal/onesignal-dotnet-api/blob/main/docs/Notification.md
    // https://documentation.onesignal.com/docs/push-notification-guide

    var notification = new Notification(
      appId: config.Value.AppId,
      targetChannel: Notification.TargetChannelEnum.Push,
      includeExternalUserIds: [clientNotification.UserId],
      headings: new StringMap(clientNotification.Title),
      contents: new StringMap(clientNotification.Message),
      url: clientNotification.OnClickUrl,
      smallIcon: "/icons/icon-transparent-bg.svg",
      chromeWebBadge: "/icons/icon-transparent-bg.svg",
      webButtons: clientNotification.Buttons
        .Select(b => new ButtonWithUrl
          {
            Id = b.Key,
            Url = b.Url,
            Text = b.Label,
            Icon = "/icons/icon-transparent-bg.svg"
          }
        )
        .OfType<Button>()
        .ToList(),
      // the following property is required to show multiple notifications at the same time.
      webPushTopic: Guid.NewGuid().ToString()
    );

    if (doNotSend)
    {
      return null;
    }

    CreateNotificationSuccessResponse response = await GetApiInstance().CreateNotificationAsync(notification);

    return response.Id;
  }

  public Task CancelNotification(string notificationId)
  {
    return Task.CompletedTask;
    
    // below does not do what i expected. need to find a different approach.
    // await GetApiInstance().CancelNotificationAsync(config.Value.AppId, notificationId);

    // gemini suggests something like this:
    // The Recommended Approach: Use an "External ID" and the "Collapse ID":
    // External ID: When a user logs into your PWA, use the OneSignal SDK's OneSignal.login() method to associate their unique user ID from your backend system with their OneSignal subscription. This "External ID" links all of a single user's devices together under one user profile in OneSignal. This is a crucial step for managing notifications across multiple devices for a single user.
    // Collapse ID: When you send a notification via the OneSignal API, you can include a collapse_id parameter. This is a unique identifier for a group of notifications. When a new notification with the same collapse_id is sent, it will replace the older one in the notification queue of the push notification service.
  }

  private DefaultApi GetApiInstance()
  {
    return new DefaultApi(
      new Configuration
      {
        BasePath = "https://onesignal.com/api/v1",
        AccessToken = config.Value.AppSecret
      }
    );
  }
}

public class ButtonWithUrl(string? id = null, string? text = null, string? icon = null, string? url = null)
  : Button(id, text, icon)
{
  [DataMember(Name = "url", IsRequired = true, EmitDefaultValue = false)]
  public string? Url { get; set; } = url;
}
