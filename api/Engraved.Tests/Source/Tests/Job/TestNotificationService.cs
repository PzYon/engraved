using Engraved.Core.Domain.Notifications;

namespace Engraved.Tests.Tests.Job;

public class TestNotificationService : INotificationService
{
  public void CancelNotification(string notificationId) { }

  public Task<string?> SendNotification(ClientNotification notification, bool doNotSend)
  {
    return Task.FromResult<string?>(Guid.NewGuid().ToString());
  }
}
