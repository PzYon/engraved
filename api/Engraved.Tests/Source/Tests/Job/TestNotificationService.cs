using Engraved.Core.Domain.Notifications;

namespace Engraved.Tests.Tests.Job;

public class TestNotificationService : INotificationService
{
  public Task<string?> SendNotification(ClientNotification notification, string entityId, bool doNotSend)
  {
    return Task.FromResult<string?>(Guid.NewGuid().ToString());
  }
}
