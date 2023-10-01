using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Commands.Measurements.Upsert.Scraps;

public class UpsertScrapsMeasurementCommand : BaseUpsertMeasurementCommand
{
  public string Title { get; set; } = null!;

  public ScrapType ScrapType { get; set; } = ScrapType.Markdown;
  
  public override JournalType GetSupportedJournalType()
  {
    return JournalType.Scraps;
  }

  public override ICommandExecutor CreateExecutor()
  {
    return new UpsertScrapsMeasurementCommandExecutor(this);
  }
}
