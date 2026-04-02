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

    var notificationKey = (entityId + "::" + clientNotification.UserId).Replace("-", "");

    var notification = new Notification(
      appId: config.Value.AppId,
      webPushTopic: notificationKey,
      collapseId: notificationKey,
      targetChannel: Notification.TargetChannelEnum.Push,
      includeAliases: new Dictionary<string, List<string>> { { "external_id", [clientNotification.UserId] } },
      headings: new LanguageStringMap(clientNotification.Title),
      contents: new LanguageStringMap(clientNotification.Message),
      url: clientNotification.OnClickUrl,
      smallIcon: "/icons/icon-transparent-bg.svg",
      chromeWebBadge: "/icons/icon-transparent-bg.svg",
      webButtons: clientNotification.Buttons
        .Select(b => new WebButton
          {
            Id = b.Key,
            Url = b.Url,
            Text = b.Label,
            Icon = "/icons/icon-transparent-bg.svg"
          }
        )
        .ToList()
    );

    if (doNotSend)
    {
      return null;
    }

    CreateNotificationSuccessResponse response = await GetApiInstance().CreateNotificationAsync(notification);

    return response.Id;
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
