namespace Engraved.Core.Domain.Notifications;

public interface INotificationService
{
  Task<string?> SendNotification(ClientNotification notification, bool doNotSend);

  Task CancelNotification(string notificationId);
}
