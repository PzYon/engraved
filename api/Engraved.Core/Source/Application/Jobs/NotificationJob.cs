using System.Diagnostics;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Notifications;
using Microsoft.Extensions.Logging;

namespace Engraved.Core.Application.Jobs;

public class NotificationJob(
  ILogger<NotificationJob> logger,
  IBaseRepository repository,
  INotificationService notificationService,
  IDateService dateService
)
{
  public async Task Execute()
  {
    try
    {
      Log($"Starting {nameof(NotificationJob)}");

      var watch = Stopwatch.StartNew();

      IEntry[] entries = await repository.GetLastEditedEntries(null, true);
      ProcessEntities(entries.OfType<IEntity>().ToArray());

      IJournal[] journals = await repository.GetAllJournals(null, true);
      ProcessEntities(journals.OfType<IEntity>().ToArray());

      Log($"Ending {nameof(NotificationJob)} after {watch.ElapsedMilliseconds}ms");
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

      notificationService.SendNotification(
        new Notification
        {
          Buttons = [],
          Message = "Test message"
        }
      );

      // todo:
      // - send notification (even consider adding a new project for OneSignal)
      // - mark IScheduled.NotificationSent = true
      // - test:
      //   - permissions
    }
  }

  private void Log(string message)
  {
    logger.LogInformation("[Background-Job]: " + message);
  }
}
