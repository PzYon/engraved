namespace Engraved.Core.Domain.Journals;

public class JournalAttribute
{
  public string Name { get; set; } = null!;

  public Dictionary<string, string> Values { get; set; } = new();
}
