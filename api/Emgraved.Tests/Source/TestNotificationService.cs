using Engraved.Core.Domain.Notifications;

namespace Emgraved.Tests;

public class TestNotificationService : INotificationService
{
  public Task SendNotification(ClientNotification notification, bool doNotSend)
  {
    throw new NotImplementedException();
  }
}
