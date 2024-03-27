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
    // as the date service is created and inject once at the start of the
    // job, we need to make sure, that we always use the current date.
    dateService.UpdateDate();

    var result = new NotificationJobResult();

    try
    {
      logger.LogInformation($"Starting {nameof(NotificationJob)} [Dry Run: {isDryRun}]");

      var watch = Stopwatch.StartNew();

      IEntry[] entries = await repository.GetLastEditedEntries(null, "ALL");
      await ProcessEntities(entries.OfType<IEntity>().ToArray(), isDryRun, result);

      IJournal[] journals = await repository.GetAllJournals(null, "ALL");
      await ProcessEntities(journals.OfType<IEntity>().ToArray(), isDryRun, result);

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

  private async Task ProcessEntities(IEntity[] entities, bool isDryRun, NotificationJobResult result)
  {
    foreach (IEntity entity in entities)
    {
      foreach ((string? userId, Schedule? schedule) in entity.Schedules.Where(
                 s => !s.Value.DidNotify && s.Value.NextOccurrence < dateService.UtcNow
               ))
      {
        try
        {
          logger.LogInformation(
            "Notification for {Name} with ID {JournalId} to {User}, scheduled at {ScheduleNextOccurrence}",
            entity.GetType().Name,
            entity.Id,
            userId,
            schedule.NextOccurrence
          );

          IUser? user = await repository.GetUser(userId);
          if (user == null)
          {
            throw new Exception($"User \"{userId}\" can not be loaded");
          }

          if (!isDryRun)
          {
            await notificationService.SendNotification(
              new ClientNotification
              {
                UserId = user.GlobalUniqueId.ToString(),
                Title = GetNotificationTitle(entity),
                Message = await GetNotificationMessage(entity),
                OnClickUrl = schedule.OnClickUrl,
                Buttons = []
              },
              false
            );

            entity.Schedules[userId].DidNotify = true;
            if (entity is IJournal journal)
            {
              await repository.UpsertJournal(journal);
            }
            else if (entity is IEntry entry)
            {
              await repository.UpsertEntry(entry);
            }
          }

          if (entity is IJournal)
          {
            result.AddJournal(userId, entity.Id!);
          }
          else if (entity is IEntry)
          {
            result.AddEntry(userId, entity.Id!);
          }
        }
        catch (Exception ex)
        {
          logger.LogError(ex, "Failed to process entry with ID {Id}", entity.Id);
        }
      }
    }
  }

  private static string? GetNotificationTitle(IEntity entity)
  {
    return entity switch
    {
      IJournal journal => journal.Name,
      ScrapsEntry scrapsEntry => scrapsEntry.Title,
      _ => string.Empty
    };
  }

  private async Task<string> GetNotificationMessage(IEntity entity)
  {
    if (entity is ScrapsEntry scrapsEntry)
    {
      IJournal? journal = await repository.GetJournal(scrapsEntry.ParentId);

      if (journal != null)
      {
        return $"Reminder in \"{journal.Name}\"";
      }
    }

    return "Reminder";
  }
}
