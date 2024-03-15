namespace Engraved.Core.Domain.Notifications;

public interface INotificationService
{
  Task SendNotification(Notification notification);
}
