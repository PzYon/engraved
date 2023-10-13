namespace Engraved.Core.Application.Commands.Entries.Delete;

public class DeleteEntryCommand : ICommand
{
  public string Id { get; set; } = null!;
}
