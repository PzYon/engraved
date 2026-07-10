using System.Text.RegularExpressions;

namespace Engraved.Core.Application.Search;

// Builds the regex for whole-word matching. \b must NOT be used for this: MongoDB's
// PCRE2 engine treats \b as ASCII-only (umlauts etc. are "non-word" characters there),
// so \b-based patterns silently fail to match words like "übung" in the DB while
// .NET's Unicode-aware \b matches them in memory. Explicit Unicode classes behave
// identically in both engines.
//
// Both the mongo free-text filter (candidate selection) and the related-items scoring
// (ranking) must use this same pattern: a candidate returned by the DB must score at
// least 1 in memory, otherwise ranking silently degrades.
public static class WholeWordRegex
{
  public static string BuildPattern(string word)
  {
    return $@"(^|[^\p{{L}}\p{{N}}]){Regex.Escape(word)}($|[^\p{{L}}\p{{N}}])";
  }

  public static bool IsMatch(string? text, string word)
  {
    return !string.IsNullOrEmpty(text)
           && Regex.IsMatch(text, BuildPattern(word), RegexOptions.IgnoreCase | RegexOptions.Multiline);
  }
}
