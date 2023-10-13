using System.Text;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Upsert;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Commands.Entries.Upsert.Timer;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Journals.Edit;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Persistence.Demo;

public class DemoDataRepositorySeeder
{
  private readonly IRepository _repository;

  public DemoDataRepositorySeeder(IRepository repository)
  {
    _repository = repository;
  }

  public async Task Seed()
  {
    await CreateRandomJournalsAndEntries();
    await AddSpecificCases();
  }

  private async Task CreateRandomJournalsAndEntries()
  {
    foreach (int _ in Enumerable.Range(0, Random.Shared.Next(5, 30)))
    {
      var dateService = new SelfIncrementingDateService();

      CommandResult result = await new AddJournalCommandExecutor(_repository, dateService).Execute(
        new AddJournalCommand
        {
          Description = LoremIpsum(0, 12, 1, 3),
          Name = LoremIpsum(1, 3, 1, 1),
          Type = GetRandomJournalType()
        }
      );

      IJournal journal = (await _repository.GetJournal(result.EntityId))!;
      await AddAttributes(journal, dateService);

      journal = (await _repository.GetJournal(result.EntityId))!;
      await AddEntries(journal, dateService);
    }
  }

  private async Task AddAttributes(IJournal journal, IDateService dateService)
  {
    var command = new EditJournalCommand
    {
      Name = journal.Name,
      JournalId = journal.Id,
      Description = journal.Description,
      Notes = Random.Shared.Next(0, 10) > 7 ? LoremIpsum(0, 12, 1, 3) : null,
      Attributes = CreateRandomDict(
        "attributeKey",
        i => new JournalAttribute
        {
          Name = "Attribute-" + i,
          Values = CreateRandomDict("valueKey", s => "value" + s)
        }
      )
    };

    await new EditJournalCommandExecutor(_repository, dateService).Execute(command);
  }

  private async Task AddEntries(IJournal journal, IDateService dateService)
  {
    switch (journal)
    {
      case CounterJournal counterJournal:
        await AddEntries(counterJournal, dateService);
        break;
      case GaugeJournal gaugeJournal:
        await AddEntries(gaugeJournal, dateService);
        break;
      case TimerJournal timerJournal:
        await AddEntries(timerJournal, dateService.UtcNow);
        break;
      case ScrapsJournal:
        // not yet implemented
        break;
      default:
        throw new Exception($"Journal type \"{journal.Type}\" is not yet supported.");
    }
  }

  private async Task AddEntries(CounterJournal journal, IDateService dateService)
  {
    foreach (int _ in Enumerable.Range(0, Random.Shared.Next(0, 30)))
    {
      var command = new UpsertCounterEntryCommand
      {
        JournalId = journal.Id!
      };

      EnsureAttributeValues(journal, command);

      await new UpsertCounterEntryCommandExecutor(_repository, dateService).Execute(command);
    }
  }

  private async Task AddEntries(GaugeJournal journal, IDateService dateService)
  {
    foreach (int _ in Enumerable.Range(0, Random.Shared.Next(0, 30)))
    {
      var command = new UpsertGaugeEntryCommand
      {
        JournalId = journal.Id!,
        Value = Random.Shared.Next(0, Random.Shared.Next(5, 150))
      };

      EnsureAttributeValues(journal, command);

      await new UpsertGaugeEntryCommandExecutor(_repository, dateService).Execute(command);
    }
  }

  private static void EnsureAttributeValues(IJournal journal, BaseUpsertEntryCommand command)
  {
    foreach (KeyValuePair<string, JournalAttribute> kvp in journal.Attributes)
    {
      string attributeKey = kvp.Key;
      string[] valueKeys = kvp.Value.Values.Keys.ToArray();
      int numberOfValueKeys = valueKeys.Length;

      if (numberOfValueKeys == 0)
      {
        break;
      }

      string randomValue = valueKeys[Random.Shared.Next(0, numberOfValueKeys)];

      command.JournalAttributeValues.Add(attributeKey, new[] { randomValue });
    }
  }

  private async Task AddEntries(TimerJournal journal, DateTime journalDate)
  {
    var dateService = new FakeDateService(journalDate);

    int[] count = Enumerable.Range(0, Random.Shared.Next(0, 30)).ToArray();

    foreach (int entryIndex in count)
    {
      int remainingSteps = (count.Length - entryIndex) * 2;

      dateService.SetNext(remainingSteps);

      var command = new UpsertTimerEntryCommand { JournalId = journal.Id! };

      EnsureAttributeValues(journal, command);

      await new UpsertTimerEntryCommandExecutor(_repository, dateService).Execute(command);

      dateService.SetNext(remainingSteps);

      await new UpsertTimerEntryCommandExecutor(_repository, dateService).Execute(
        new UpsertTimerEntryCommand { JournalId = journal.Id! }
      );
    }
  }

  private async Task AddSpecificCases()
  {
    await AddSpecificCase(SpecificCases.GetMigraineMedicineCase());
    await AddSpecificCase(SpecificCases.GetOffByOneEdgeCase());
  }

  private async Task AddSpecificCase(SpecificCase specificCase)
  {
    var dateService = new SelfIncrementingDateService();
    IJournal journal = specificCase.Journal;

    CommandResult result = await new AddJournalCommandExecutor(_repository, dateService).Execute(
      new AddJournalCommand
      {
        Description = journal.Description,
        Name = journal.Name,
        Type = journal.Type
      }
    );

    string journalId = result.EntityId;

    if (journal.Attributes.Any())
    {
      await new EditJournalCommandExecutor(_repository, dateService).Execute(
        new EditJournalCommand
        {
          JournalId = journalId,
          Attributes = journal.Attributes,
          Description = journal.Description,
          Name = journal.Name
        }
      );
    }

    foreach (IEntry entry in specificCase.Entries)
    {
      BaseUpsertEntryCommand command;

      switch (entry)
      {
        case CounterEntry:
          command = new UpsertCounterEntryCommand();
          break;
        case GaugeEntry gaugeEntry:
          command = new UpsertGaugeEntryCommand { Value = gaugeEntry.Value };
          break;
        case TimerEntry:
          throw new NotImplementedException();
        default:
          throw new ArgumentOutOfRangeException(nameof(entry));
      }

      command.JournalId = journalId;
      command.Notes = entry.Notes;
      command.JournalAttributeValues = entry.JournalAttributeValues;

      IDateService entryDateService = entry.DateTime != null
        ? new FakeDateService(entry.DateTime.Value)
        : dateService;

//      _dispatcher.Query<>()
//      
//      await command.CreateExecutor().Execute(_repository, entryDateService);
    }
  }

  private static JournalType GetRandomJournalType()
  {
    return (JournalType) Random.Shared.Next(0, Enum.GetNames(typeof(JournalType)).Length);
  }

  private static Dictionary<string, T> CreateRandomDict<T>(string keyPrefix, Func<int, T> createValue)
  {
    int count = Random.Shared.Next(0, 7);

    var dict = new Dictionary<string, T>();

    for (var i = 0; i < count; i++)
    {
      dict.Add(keyPrefix + i, createValue(i));
    }

    return dict;
  }

  // https://stackoverflow.com/questions/4286487/is-there-any-lorem-ipsum-generator-in-c
  private static string LoremIpsum(int minWords, int maxWords, int minSentences, int maxSentences)
  {
    var words = new[]
    {
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetuer",
      "adipiscing", "elit", "sed", "diam", "nonummy", "nibh", "euismod",
      "tincidunt", "ut", "laoreet", "dolore", "magna", "aliquam", "erat"
    };

    int numSentences = Random.Shared.Next(minSentences, maxSentences);
    int numWords = Random.Shared.Next(minWords, maxWords);

    if (numWords == 0 || numSentences == 0)
    {
      return string.Empty;
    }

    var result = new StringBuilder();

    for (var s = 0; s < numSentences; s++)
    {
      for (var w = 0; w < numWords; w++)
      {
        if (w > 0)
        {
          result.Append(' ');
        }

        result.Append(words[Random.Shared.Next(words.Length)]);
      }

      result.Append(". ");
    }

    return result.ToString();
  }
}
