namespace Engraved.Core.Domain.Measurements;

public abstract class BaseMeasurement : IMeasurement
{
  public string? Id { get; set; }

  public string? UserId { get; set; }

  public string ParentId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public DateTime? EditedOn { get; set; }

  public Dictionary<string, string[]> JournalAttributeValues { get; set; } = new();

  public abstract double GetValue();
}
