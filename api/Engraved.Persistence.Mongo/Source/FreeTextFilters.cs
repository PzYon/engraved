using System.Linq.Expressions;
using System.Text.RegularExpressions;
using Engraved.Core.Application.Search;
using Engraved.Persistence.Mongo.DocumentTypes;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public static class FreeTextFilters
{
  // matchAnyWord = false: every word must match somewhere (one AND-ed filter per word,
  // substring semantics) - this is the regular search behavior.
  // matchAnyWord = true: a single filter matching documents that contain ANY of the words,
  // as whole words (via WholeWordRegex) - used to collect candidates for "related items",
  // where requiring all words would be far too strict and substring matches are mostly noise.
  public static List<FilterDefinition<T>> Build<T>(
    string? searchText,
    bool matchAnyWord,
    params Expression<Func<T, object>>[] fieldNameExpressions
  ) where T : IDocument
  {
    if (string.IsNullOrEmpty(searchText))
    {
      return [];
    }

    List<FilterDefinition<T>> perWordFilters = searchText.Split(" ")
      .Select(segment =>
        {
          // Escape the user input so it is matched literally. Passing it to the
          // regex engine unescaped allowed malformed patterns (exceptions) and
          // catastrophic-backtracking patterns (ReDoS) to be injected via search.
          var pattern = matchAnyWord
            ? WholeWordRegex.BuildPattern(segment)
            : Regex.Escape(segment);

          return Builders<T>.Filter.Or(
            fieldNameExpressions.Select(exp => Builders<T>.Filter.Regex(
                exp,
                new BsonRegularExpression(
                  new Regex(pattern, RegexOptions.IgnoreCase | RegexOptions.Multiline)
                )
              )
            )
          );
        }
      )
      .ToList();

    return matchAnyWord
      ? [Builders<T>.Filter.Or(perWordFilters)]
      : perWordFilters;
  }
}
