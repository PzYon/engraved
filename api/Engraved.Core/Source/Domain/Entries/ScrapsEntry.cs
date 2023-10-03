namespace Engraved.Core.Domain.Entries;

public class ScrapsEntry : BaseEntry
{
  public string Title { get; set; } = null!;

  public ScrapType ScrapType { get; set; } = ScrapType.Markdown;

  public override double GetValue()
  {
    throw new NotImplementedException();
  }
}
