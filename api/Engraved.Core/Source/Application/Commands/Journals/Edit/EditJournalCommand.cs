using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Edit;

public class EditJournalCommand : ICommand
{
  public string? JournalId { get; set; }

  public string? Name { get; set; }

  public string? Description { get; set; }

  public string? Notes { get; set; }

  public Dictionary<string, JournalAttribute> Attributes { get; set; } = new();

  public Dictionary<string, Dictionary<string, double>> Thresholds { get; set; } = new();

  public Dictionary<string, string> CustomProps { get; set; } = new();
}
