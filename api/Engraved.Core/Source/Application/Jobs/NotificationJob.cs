﻿using System.Diagnostics;
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
  public async Task Execute(bool isDryRun)
  {
    try
    {
      logger.LogInformation($"Starting {nameof(NotificationJob)} [Dry Run: {isDryRun}]");

      var watch = Stopwatch.StartNew();

      IEntry[] entries = await repository.GetLastEditedEntries(null, "ALL");
      await ProcessEntries(entries, isDryRun);

      IJournal[] journals = await repository.GetAllJournals(null, "ALL");
      await ProcessJournals(journals, isDryRun);

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

  private async Task ProcessJournals(IJournal[] journals, bool isDryRun)
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
          }
        }
        catch (Exception ex)
        {
          logger.LogError(ex, "Failed to process journal with ID {Id}", journal.Id);
        }
      }
    }
  }

  private async Task ProcessEntries(IEntry[] entries, bool isDryRun)
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
          }
        }
        catch (Exception ex)
        {
          logger.LogError(ex, "Failed to process entry with ID {Id}", entry.Id);
        }
      }
    }
  }
}
