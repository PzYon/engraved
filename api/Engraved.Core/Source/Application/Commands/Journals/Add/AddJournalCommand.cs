using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Commands.Journals.Add;

public class AddJournalCommand : ICommand
{
  public string? Name { get; set; }

  public string? Description { get; set; }

  public JournalType Type { get; set; }
}
