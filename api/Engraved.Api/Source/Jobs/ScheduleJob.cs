namespace Engraved.Api.Jobs;

public class ScheduleJob(ILogger<ScheduleJob> logger) : BackgroundService
{
  private readonly TimeSpan _period = TimeSpan.FromSeconds(30);

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    using (var timer = new PeriodicTimer(_period))
    {
      while (
        !stoppingToken.IsCancellationRequested
        && await timer.WaitForNextTickAsync(stoppingToken)
      )
      {
        logger.LogInformation("I am job.");
      }
    }
  }
}
