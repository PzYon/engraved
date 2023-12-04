namespace Engraved.Core.Application.Commands.Journals.Edit;

public static class KeyNormalizer
{
  private const string InvalidCharReplacement = "_";
  private static readonly string[] InvalidCharsForKeys = { ",", ";", "?", ":", "=" };

  public static Dictionary<string, T> Normalize<T>(Dictionary<string, T> dict)
  {
    return dict.ToDictionary(
      kvp => InvalidCharsForKeys.Aggregate(
        kvp.Key,
        (current, invalidChar) => current.Replace(invalidChar, InvalidCharReplacement)
      ),
      kvp => kvp.Value
    );
  }
}
