using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Api.Jobs;

public class ScheduleJob(ILogger<ScheduleJob> logger, IRepository repository, IDateService dateService)
  : BackgroundService
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
        Log("Start");

        IEntry[] entries = await repository.GetLastEditedEntries(
          Array.Empty<string>(),
          null,
          Array.Empty<JournalType>(),
          null,
          true
        );

        foreach (IEntry entry in entries)
        {
          if (entry.Schedule?.NextOccurrence < dateService.UtcNow)
          {
            Log(
              $"Would send notification for entry with ID {entry.Id}, scheduled at {entry.Schedule.NextOccurrence}"
            );
          }
        }

        IJournal[] journals = await repository.GetAllJournals(
          null,
          Array.Empty<JournalType>(),
          Array.Empty<string>(),
          null,
          true
        );

        foreach (IJournal journal in journals)
        {
          if (journal.Schedule?.NextOccurrence < dateService.UtcNow)
          {
            Log(
              $"Would send notification for journal with ID {journal.Id}, scheduled at {journal.Schedule.NextOccurrence}"
            );
          }
        }

        Log("End");
      }
    }
  }

  private void Log(string message)
  {
    logger.LogInformation("[Background-Job]: " + message);
  }
}
