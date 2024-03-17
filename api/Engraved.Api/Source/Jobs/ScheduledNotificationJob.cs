using Engraved.Core.Application.Jobs;
using Microsoft.Extensions.Options;

namespace Engraved.Api.Jobs;

public class ScheduledNotificationJob(
  NotificationJob notificationJob,
  IOptions<NotificationsJobConfig> notificationsJobConfig
)
  : BackgroundService
{
  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    if (notificationsJobConfig.Value.Mode == NotificationsJobMode.Disabled
        || notificationsJobConfig.Value.IntervalInMinutes == 0)
    {
      return;
    }

    using (var timer = new PeriodicTimer(TimeSpan.FromMinutes(notificationsJobConfig.Value.IntervalInMinutes)))
    {
      while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
      {
        bool isDryRun = notificationsJobConfig.Value.Mode == NotificationsJobMode.DryRun;
        await notificationJob.Execute(isDryRun);
      }
    }
  }
}
