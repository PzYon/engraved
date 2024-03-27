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
  public Task SendNotification(ClientNotification clientNotification, bool doNotSend)
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
      headings: new StringMap(en: clientNotification.Title),
      contents: new StringMap(en: clientNotification.Message),
      url: clientNotification.OnClickUrl,
      chromeWebBadge: "/icons/icon_windows.png",
      webButtons: clientNotification.Buttons
        .Select(
          b => new ButtonWithUrl
          {
            Id = b.Key,
            Url = b.Url,
            Text = b.Label
          }
        )
        .OfType<Button>()
        .ToList(),
      // the following property is required to show multiple notifications at the same time.
      webPushTopic: Guid.NewGuid().ToString()
    );

    if (doNotSend)
    {
      return Task.CompletedTask;
    }

    GetApiInstance().CreateNotification(notification);
    return Task.CompletedTask;
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
