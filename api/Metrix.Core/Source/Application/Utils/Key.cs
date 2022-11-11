namespace Metrix.Core.Application.Utils;

public class KeyNormalizer
{
  private const string InvalidCharReplacement = "_";
  private static readonly string[] InvalidCharsForKeys = { ",", ";", "?", ":", "=" };

  public static Dictionary<string, T> Normalize<T>(Dictionary<string, T> dict)
  {
    Dictionary<string, T> newDict = new();

    foreach (KeyValuePair<string, T> kvp in dict)
    {
      string newKey = InvalidCharsForKeys.Aggregate(
        kvp.Key,
        (current, invalidChar) => current.Replace(invalidChar, InvalidCharReplacement)
      );

      newDict.Add(newKey, kvp.Value);
    }

    return newDict;
  }
}
