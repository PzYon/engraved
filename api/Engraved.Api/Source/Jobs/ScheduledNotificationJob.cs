using Engraved.Core.Application.Jobs;

namespace Engraved.Api.Jobs;

public class ScheduledNotificationJob(NotificationJob notificationJob) : BackgroundService
{
  private readonly TimeSpan _period = TimeSpan.FromMinutes(2);

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    using (var timer = new PeriodicTimer(_period))
    {
      while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
      {
        await notificationJob.Execute();
      }
    }
  }
}
