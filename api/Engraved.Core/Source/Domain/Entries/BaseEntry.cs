namespace Engraved.Core.Domain.Entries;

public abstract class BaseEntry : IEntry
{
  public string? Id { get; set; }

  public string? UserId { get; set; }

  public string ParentId { get; set; } = null!;

  public string? Notes { get; set; }

  public DateTime? DateTime { get; set; }

  public DateTime? EditedOn { get; set; }

  public Dictionary<string, string[]> JournalAttributeValues { get; set; } = new();

  public abstract double GetValue();

  public Schedule? Schedule { get; set; }

  public Dictionary<string, Schedule> Schedules { get; set; } = new();
}
