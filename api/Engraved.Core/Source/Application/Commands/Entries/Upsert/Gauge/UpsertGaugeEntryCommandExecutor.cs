using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Gauge;

public class UpsertGaugeEntryCommandExecutor : BaseUpsertEntryCommandExecutor<
  UpsertGaugeEntryCommand,
  GaugeEntry,
  GaugeJournal
>
{
  public UpsertGaugeEntryCommandExecutor(IRepository repository, IDateService dateService)
    : base(repository, dateService) { }

  protected override Task PerformTypeSpecificValidation(UpsertGaugeEntryCommand command)
  {
    if (command.Value == null)
    {
      throw CreateInvalidCommandException(command, $"\"{nameof(UpsertGaugeEntryCommand.Value)}\" must be specified");
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(UpsertGaugeEntryCommand command, GaugeEntry entry)
  {
    entry.Value = command.Value!.Value;
  }
}
