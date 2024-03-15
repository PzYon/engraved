namespace Engraved.Core.Domain.Notifications;

public class Notification
{
  public string Message { get; set; }
  public List<NotificationButton> Buttons { get; set; }
}
