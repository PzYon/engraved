namespace Engraved.Core.Application.Commands.Journals.UpdateTags;

public class UpdateJournalUserTagsCommand : ICommand
{
  public string JournalId { get; set; } = null!;

  public List<string> TagIds { get; set; } = [];
}
