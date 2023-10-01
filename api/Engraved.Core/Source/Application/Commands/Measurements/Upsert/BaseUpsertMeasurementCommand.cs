using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Measurements.Upsert;

public abstract class BaseUpsertMeasurementCommand : ICommand
{
  public string? Id { get; set; }

  public string JournalId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public Dictionary<string, string[]> JournalAttributeValues { get; set; } = new();

  public abstract ICommandExecutor CreateExecutor();

  public abstract JournalType GetSupportedJournalType();
}
