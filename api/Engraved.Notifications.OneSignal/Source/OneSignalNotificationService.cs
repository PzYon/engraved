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
  public async Task<string?> SendNotification(ClientNotification clientNotification, string entityId, bool doNotSend)
  {
    EnsureValidConfig();

    if (string.IsNullOrEmpty(clientNotification.UserId))
    {
      throw new NotAllowedOperationException(
        $"Cannot send OneSignal message, as ${nameof(ClientNotification.UserId)} is not available."
      );
    }

    // valid resources:
    // https://github.com/OneSignal/onesignal-dotnet-api/blob/main/docs/Notification.md
    // https://documentation.onesignal.com/docs/push-notification-guide

    var id = CalculateCollapseId(clientNotification.UserId, entityId);

    var notification = new Notification(
      appId: config.Value.AppId,
      collapseId: id,
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
      webPushTopic: id
    );

    if (doNotSend)
    {
      return null;
    }

    CreateNotificationSuccessResponse response = await GetApiInstance().CreateNotificationAsync(notification);

    return response.Id;
  }

  public async Task CancelNotification(string userId, string entityId, bool doNotSend)
  {
    // below stuff also does not work. what i would like to do is prevent notifications
    // from being shown, if they have already been consumed on another device.
    // return Task.CompletedTask;

    EnsureValidConfig();

    var id = CalculateCollapseId(userId, entityId);

    var notification = new Notification(
      appId: config.Value.AppId,
      collapseId: id,
      targetChannel: Notification.TargetChannelEnum.Push,
      includeExternalUserIds: [userId],
      webPushTopic: id,
      contentAvailable: true
    );

    if (doNotSend)
    {
      return;
    }

    await GetApiInstance().CreateNotificationAsync(notification);
  }

  private void EnsureValidConfig()
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
  }

  private static string CalculateCollapseId(string globallyUniqueUserId, string entityId)
  {
    return (globallyUniqueUserId + "::" + entityId).Replace("-", string.Empty);
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
