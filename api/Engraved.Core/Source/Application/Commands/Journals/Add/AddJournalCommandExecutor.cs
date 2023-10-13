using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Add;

public class AddJournalCommandExecutor : ICommandExecutor<AddJournalCommand>
{
  private readonly IRepository _repository;
  private readonly IDateService _dateService;

  public AddJournalCommandExecutor(IRepository repository, IDateService dateService)
  {
    _repository = repository;
    _dateService = dateService;
  }

  public async Task<CommandResult> Execute(AddJournalCommand command)
  {
    // todo:
    // - validate key is not null
    // - validate key is unique
    // - validate name is not null (done below -> add test)
    // - consider adding a created (and last modified?) date

    if (string.IsNullOrEmpty(command.Name))
    {
      throw new InvalidCommandException(command, $"\"{nameof(command.Name)}\" must be specified");
    }

    IJournal journal = CreateJournal(command.Type);
    journal.Description = command.Description;
    journal.Name = command.Name;
    journal.EditedOn = _dateService.UtcNow;
    UpsertResult result = await _repository.UpsertJournal(journal);

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
