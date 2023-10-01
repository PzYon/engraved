using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Entries.Upsert.Gauge;

public class UpsertGaugeEntryCommandExecutor : BaseUpsertEntryCommandExecutor<
  UpsertGaugeEntryCommand,
  GaugeEntry,
  GaugeJournal
>
{
  public UpsertGaugeEntryCommandExecutor(UpsertGaugeEntryCommand command) : base(command) { }

  protected override Task PerformTypeSpecificValidation()
  {
    if (Command.Value == null)
    {
      throw CreateInvalidCommandException($"\"{nameof(UpsertGaugeEntryCommand.Value)}\" must be specified");
    }

    return Task.CompletedTask;
  }

  protected override void SetTypeSpecificValues(IDateService dateService, GaugeEntry entry)
  {
    entry.Value = Command.Value!.Value;
  }
}
