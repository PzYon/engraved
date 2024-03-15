using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Notifications;
using Microsoft.Extensions.Logging.Abstractions;
using NUnit.Framework;

namespace Engraved.Core.Application.Jobs;

public class TestNotificationService : INotificationService
{
  public Task SendNotification(ClientNotification notification, bool doNotSend)
  {
    throw new System.NotImplementedException();
  }
}

public class NotificationJobShould
{
  [Test]
  public async Task Initial()
  {
    var repository = new InMemoryRepository();
    var notificationService = new TestNotificationService();

    var job = new NotificationJob(
      NullLogger<NotificationJob>.Instance,
      repository,
      notificationService
    );

    await job.Execute();
  }
}
