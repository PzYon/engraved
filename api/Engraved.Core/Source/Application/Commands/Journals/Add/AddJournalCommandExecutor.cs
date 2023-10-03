using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Add;

public class AddJournalCommandExecutor : ICommandExecutor
{
  private readonly AddJournalCommand _command;

  public AddJournalCommandExecutor(AddJournalCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    // todo:
    // - validate key is not null
    // - validate key is unique
    // - validate name is not null (done below -> add test)
    // - consider adding a created (and last modified?) date

    if (string.IsNullOrEmpty(_command.Name))
    {
      throw new InvalidCommandException(_command, $"\"{nameof(_command.Name)}\" must be specified");
    }

    IJournal journal = CreateJournal(_command.Type);
    journal.Description = _command.Description;
    journal.Name = _command.Name;
    journal.EditedOn = dateService.UtcNow;
    UpsertResult result = await repository.UpsertJournal(journal);

    return new CommandResult(result.EntityId, Array.Empty<string>());
  }

  private static IJournal CreateJournal(JournalType type)
  {
    return type switch
    {
      JournalType.Counter => new CounterJournal(),
      JournalType.Gauge => new GaugeJournal(),
      JournalType.Timer => new TimerJournal(),
      JournalType.Scraps => new ScrapsJournal(),
      _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
    };
  }
}
