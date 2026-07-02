using Engraved.Core.Application.Jobs;
using Microsoft.Extensions.Options;

namespace Engraved.Api.Jobs;

public class ScheduledNotificationJob(
  IServiceScopeFactory serviceScopeFactory,
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

        // a fresh scope per run so the job and its dependencies (repository, date service, ...)
        // are created anew every time instead of being captured once by this singleton.
        using (IServiceScope scope = serviceScopeFactory.CreateScope())
        {
          var notificationJob = scope.ServiceProvider.GetRequiredService<NotificationJob>();
          await notificationJob.Execute(isDryRun);
        }
      }
    }
  }
}
