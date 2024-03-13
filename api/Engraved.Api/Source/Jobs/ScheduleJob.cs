using System.Diagnostics;
using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Api.Jobs;

public class ScheduleJob(ILogger<ScheduleJob> logger, IBaseRepository repository, IDateService dateService)
  : BackgroundService
{
  private readonly TimeSpan _period = TimeSpan.FromMinutes(2);

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    using (var timer = new PeriodicTimer(_period))
    {
      while (
        !stoppingToken.IsCancellationRequested
        && await timer.WaitForNextTickAsync(stoppingToken)
      )
      {
        await Execute();
      }
    }
  }

  private async Task Execute()
  {
    try
    {
      Log($"Starting {nameof(ScheduleJob)}");

      var watch = Stopwatch.StartNew();
        
      IEntry[] entries = await repository.GetLastEditedEntries(
        Array.Empty<string>(),
        null,
        Array.Empty<JournalType>(),
        null,
        true
      );

      ProcessEntities(entries.OfType<IEntity>().ToArray());

      IJournal[] journals = await repository.GetAllJournals(
        null,
        Array.Empty<JournalType>(),
        Array.Empty<string>(),
        null,
        true
      );

      ProcessEntities(journals.OfType<IEntity>().ToArray());

      Log($"Ending {nameof(ScheduleJob)} after {watch.ElapsedMilliseconds}ms");
    }
    catch (Exception ex)
    {
      logger.LogError($"Error while processing job: ${ex.Message}", ex);
    }
  }

  private void ProcessEntities(IEntity[] entities)
  {
    foreach (IEntity entity in entities.Where(e => e.Schedule?.NextOccurrence < dateService.UtcNow))
    {
      Log(
        $"Would send notification for {entity.GetType().Name} with ID {entity.Id}, scheduled at {entity.Schedule?.NextOccurrence}"
      );
      
      // todo:
      // - send notification
      // - mark IScheduled.NotificationSent = true
    }
  }

  private void Log(string message)
  {
    logger.LogInformation("[Background-Job]: " + message);
  }
}
