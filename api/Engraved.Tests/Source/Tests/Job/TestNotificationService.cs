using Engraved.Core.Domain.Notifications;

namespace Engraved.Tests.Tests.Job;

public class TestNotificationService : INotificationService
{
  public Task<string?> SendNotification(ClientNotification notification, bool doNotSend)
  {
    return Task.FromResult<string?>(Guid.NewGuid().ToString());
  }

  public Task CancelNotification(string id, string userId, bool doNotSend)
  {
    return Task.CompletedTask;
  }
}
