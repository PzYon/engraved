namespace Engraved.Core.Domain.Notifications;

public interface INotificationService
{
  Task<string?> SendNotification(ClientNotification notification, string entityId, bool doNotSend);
}
