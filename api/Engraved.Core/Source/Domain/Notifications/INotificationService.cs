namespace Engraved.Core.Domain.Notifications;

public interface INotificationService
{
  Task SendNotification(ClientNotification notification, bool doNotSend);
}
