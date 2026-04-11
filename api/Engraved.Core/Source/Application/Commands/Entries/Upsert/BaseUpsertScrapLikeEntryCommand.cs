using Engraved.Core.Application.Commands.Entries.AddSchedule;

namespace Engraved.Core.Application.Commands.Entries.Upsert;

public abstract class BaseUpsertScrapLikeEntryCommand : BaseUpsertEntryCommand
{
  public AddScheduleToEntryCommand? Schedule { get; set; }
}
