using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Notifications;

namespace Engraved.Core.Tests.Application.Jobs;

public class TestNotificationService : INotificationService
{
  public Task<string?> SendNotification(ClientNotification notification, string entityId, bool doNotSend)
  {
    return Task.FromResult<string?>(Guid.NewGuid().ToString());
  }
}
