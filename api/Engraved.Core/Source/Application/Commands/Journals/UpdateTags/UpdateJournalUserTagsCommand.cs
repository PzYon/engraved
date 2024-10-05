namespace Engraved.Core.Application.Commands.Journals.UpdateTags;

public class UpdateJournalUserTagsCommand : ICommand
{
  public string JournalId { get; set; }

  public List<string> TagIds { get; set; } = [];
}
