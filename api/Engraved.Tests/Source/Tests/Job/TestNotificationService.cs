using Engraved.Core.Domain.Notifications;

namespace Engraved.Tests.Tests.Job;

public class TestNotificationService : INotificationService
{
  public Task SendNotification(ClientNotification notification, bool doNotSend)
  {
    return Task.CompletedTask;
  }
}
