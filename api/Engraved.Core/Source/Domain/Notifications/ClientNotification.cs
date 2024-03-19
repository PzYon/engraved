namespace Engraved.Core.Domain.Notifications;

public class ClientNotification
{
  public string? UserId { get; set; }
  public string? Message { get; set; }
  public string? OnClickUrl { get; set; }
  public List<NotificationButton> Buttons { get; set; } = [];
}
