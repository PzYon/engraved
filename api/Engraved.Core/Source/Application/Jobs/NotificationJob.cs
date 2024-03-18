using System.Diagnostics;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Notifications;
using Engraved.Core.Domain.User;
using Microsoft.Extensions.Logging;

namespace Engraved.Core.Application.Jobs;

public class NotificationJob(
  ILogger<NotificationJob> logger,
  IBaseRepository repository,
  IDateService dateService,
  INotificationService notificationService
)
{
  public async Task<NotificationJobResult> Execute(bool isDryRun)
  {
    var result = new NotificationJobResult();

    try
    {
      logger.LogInformation($"Starting {nameof(NotificationJob)} [Dry Run: {isDryRun}]");

      var watch = Stopwatch.StartNew();

      IEntry[] entries = await repository.GetLastEditedEntries(null, "ALL");
      await ProcessEntries(entries, isDryRun, result);

      IJournal[] journals = await repository.GetAllJournals(null, "ALL");
      await ProcessJournals(journals, isDryRun, result);

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

    return result;
  }

  private async Task ProcessJournals(IJournal[] journals, bool isDryRun, NotificationJobResult result)
  {
    foreach (IJournal journal in journals)
    {
      foreach ((string? userName, Schedule? schedule) in journal.Schedules.Where(
                 s => s.Value.NextOccurrence < dateService.UtcNow
               ))
      {
        try
        {
          logger.LogInformation(
            "Would send notification for {Name} with ID {JournalId} to {User}, scheduled at {ScheduleNextOccurrence}",
            journal.GetType().Name,
            journal.Id,
            userName,
            schedule.NextOccurrence
          );

          IUser? user = await repository.GetUser(userName);
          if (user == null)
          {
            throw new Exception($"User {userName} can not be loaded");
          }

          if (!isDryRun)
          {
            await notificationService.SendNotification(
              new ClientNotification
              {
                UserId = user.GlobalUniqueId.ToString(),
                Buttons = [],
                Message = journal.Name
              },
              true
            );

            journal.Schedules[userName].DidNotify = true;
            await repository.UpsertJournal(journal);
          }

          result.AddJournal(userName, journal.Id!);
        }
        catch (Exception ex)
        {
          logger.LogError(ex, "Failed to process journal with ID {Id}", journal.Id);
        }
      }
    }
  }

  private async Task ProcessEntries(IEntry[] entries, bool isDryRun, NotificationJobResult result)
  {
    foreach (IEntry entry in entries)
    {
      foreach ((string? userName, Schedule? schedule) in entry.Schedules.Where(
                 s => s.Value.NextOccurrence < dateService.UtcNow
               ))
      {
        try
        {
          logger.LogInformation(
            "Would send notification for {Name} with ID {JournalId} to {User}, scheduled at {ScheduleNextOccurrence}",
            entry.GetType().Name,
            entry.Id,
            userName,
            schedule.NextOccurrence
          );

          IUser? user = await repository.GetUser(userName);
          if (user == null)
          {
            throw new Exception($"User {userName} can not be loaded");
          }

          if (!isDryRun)
          {
            await notificationService.SendNotification(
              new ClientNotification
              {
                UserId = user.GlobalUniqueId.ToString(),
                Buttons = [],
                Message = (entry as ScrapsEntry)?.Title ?? "???"
              },
              true
            );
            
            entry.Schedules[userName].DidNotify = true;
            await repository.UpsertEntry(entry);
          }

          result.AddEntry(userName, entry.Id!);
        }
        catch (Exception ex)
        {
          logger.LogError(ex, "Failed to process entry with ID {Id}", entry.Id);
        }
      }
    }
  }
}
