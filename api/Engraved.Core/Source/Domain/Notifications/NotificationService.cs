using Microsoft.Extensions.Logging;

namespace Engraved.Core.Domain.Notifications;

public class NotificationService(ILogger<NotificationService> logger) : INotificationService
{
  public Task SendNotification(Notification notification)
  {
    logger.LogInformation("Sending notification with " + notification.Message);
    return Task.CompletedTask;
  }
}
