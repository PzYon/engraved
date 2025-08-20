namespace Engraved.Core.Domain.Notifications;

public interface INotificationService
{
  Task<string?> SendNotification(ClientNotification notification, bool doNotSend);

  void CancelNotification(string notificationId);
}
