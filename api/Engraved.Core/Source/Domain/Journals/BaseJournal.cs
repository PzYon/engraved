using Engraved.Core.Domain.Permissions;

namespace Engraved.Core.Domain.Journals;

public abstract class BaseJournal : IJournal
{
  public string? Id { get; set; }

  public string? UserId { get; set; }

  public string Name { get; set; } = null!;

  public string? Description { get; set; }

  public string? Notes { get; set; }

  public abstract JournalType Type { get; }

  public Dictionary<string, JournalAttribute> Attributes { get; set; } = new();

  public Dictionary<string, Dictionary<string, double>> Thresholds { get; set; } = new();

  public DateTime? EditedOn { get; set; }

  public Dictionary<string, string> CustomProps { get; set; } = new();

  public UserPermissions Permissions { get; set; } = new();
}
