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

    var notification = new Notification(
      appId: config.Value.AppId,
      targetChannel: Notification.TargetChannelEnum.Push,
      includeExternalUserIds: [clientNotification.UserId],
      contents: new StringMap(en: clientNotification.Message),
      url: clientNotification.OnClickUrl,
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
        .ToList()
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
