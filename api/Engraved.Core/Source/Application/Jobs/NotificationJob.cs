using System.Diagnostics;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Notifications;
using Microsoft.Extensions.Logging;

namespace Engraved.Core.Application.Jobs;

// todo:
// - send notification (even consider adding a new project for OneSignal)
// - mark IScheduled.NotificationSent = true
// - test:
//   - permissions

public class NotificationJob(
  ILogger<NotificationJob> logger,
  IBaseRepository repository,
  INotificationService notificationService
)
{
  public async Task Execute()
  {
    try
    {
      logger.LogInformation($"Starting {nameof(NotificationJob)}");

      var watch = Stopwatch.StartNew();

      IEntry[] entries = await repository.GetLastEditedEntries(null, true);
      await ProcessEntries(entries);

      IJournal[] journals = await repository.GetAllJournals(null, true);
      await ProcessJournals(journals);

      logger.LogInformation(
        "Ending {JobName} after {ElapsedMs}ms",
        nameof(NotificationJob),
        watch.ElapsedMilliseconds
      );
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Error while processing job: ${ExMessage}", ex.Message);
    }
  }

  private async Task ProcessJournals(IJournal[] journals)
  {
    foreach (IJournal journal in journals)
    {
      try
      {
        logger.LogInformation(
          "Would send notification for {Name} with ID {JournalId}, scheduled at {ScheduleNextOccurrence}",
          journal.GetType().Name,
          journal.Id,
          journal.Schedule?.NextOccurrence
        );

        await notificationService.SendNotification(
          new ClientNotification
          {
            UserId = "not-available-yet",
            Buttons = [],
            Message = journal.Name
          },
          true
        );
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Failed to process journal with ID {Id}", journal.Id);
      }
    }
  }

  private async Task ProcessEntries(IEntry[] entries)
  {
    foreach (IEntry entry in entries)
    {
      try
      {
        logger.LogInformation(
          "Would send notification for {Name} with ID {EntryId}, scheduled at {ScheduleNextOccurrence}",
          entry.GetType().Name,
          entry.Id,
          entry.Schedule?.NextOccurrence
        );

        await notificationService.SendNotification(
          new ClientNotification
          {
            UserId = "not-available-yet",
            Buttons = [],
            Message = (entry as ScrapsEntry)?.Title ?? "???"
          },
          true
        );
      }
      catch (Exception ex)
      {
        logger.LogError(ex, "Failed to process entry with ID {Id}", entry.Id);
      }
    }
  }
}
