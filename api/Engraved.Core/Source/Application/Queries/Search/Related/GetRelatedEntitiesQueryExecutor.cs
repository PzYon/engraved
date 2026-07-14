using System.Text.RegularExpressions;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search.Related;

// Finds items "related" to a given journal or entry, purely for navigation purposes:
// the source item's own journal (and its entries) are deliberately excluded, as they
// are already visible on the page the user is coming from. Relatedness is based on
// word overlap: candidates are fetched with a single match-any-word query and then
// ranked in memory (no $text/Atlas Search available on the Cosmos DB Mongo API).
public class GetRelatedEntitiesQueryExecutor(IJournalRepository journalRepository, IEntryRepository entryRepository)
  : IQueryExecutor<SearchEntitiesResult, GetRelatedEntitiesQuery>
{
  private const int MaxWords = 10;
  private const int MinWordLength = 3;
  private const int CandidateLimit = 50;
  private const int DefaultResultLimit = 10;

  // only entries of these types have their own routes in the app, so only they
  // are valid navigation targets. journals of ALL types are considered.
  private static readonly JournalType[] NavigableEntryTypes = [JournalType.Scraps, JournalType.LogBook];

  private static readonly HashSet<string> StopWords =
  [
    // english
    "the", "and", "for", "with", "this", "that", "these", "those", "from", "are",
    "was", "were", "has", "have", "had", "not", "you", "your", "all", "any",
    "can", "will", "one", "how", "what", "when", "where", "why", "who", "which",
    // german
    "und", "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen",
    "einem", "einer", "ist", "sind", "war", "mit", "von", "für", "auf", "aus",
    "bei", "nach", "über", "unter", "nicht", "auch", "wie", "was", "wann", "wer",
    "oder", "aber", "als", "zum", "zur", "ich", "sie", "wir"
  ];

  public bool DisableCache => false;

  public async Task<SearchEntitiesResult> Execute(GetRelatedEntitiesQuery query)
  {
    if (string.IsNullOrEmpty(query.EntityId))
    {
      throw new InvalidQueryException(
        query,
        $"{nameof(GetRelatedEntitiesQuery.EntityId)} must be specified."
      );
    }

    SourceContext source = await LoadSource(query);
    if (source.OwnJournalId == null)
    {
      return new SearchEntitiesResult();
    }

    var words = GetRelevantWords(source.SourceText);
    if (words.Length == 0)
    {
      return new SearchEntitiesResult();
    }

    var searchText = string.Join(" ", words);

    var allJournals = await journalRepository.GetAllJournals(null, null, null, null, 1000);

    var otherJournalIds = allJournals
      .Select(j => j.Id!)
      .Where(id => id != source.OwnJournalId)
      .ToArray();

    var journalCandidatesTask = journalRepository.GetAllJournals(
      searchText,
      null,
      null,
      null,
      CandidateLimit,
      null,
      true
    );

    // passing otherJournalIds both scopes the (unscoped) entry search to journals the
    // user may read AND excludes the source item's own journal (see class comment).
    var entryCandidatesTask = otherJournalIds.Length > 0
      ? entryRepository.SearchEntries(
        searchText,
        null,
        NavigableEntryTypes,
        otherJournalIds,
        CandidateLimit,
        null,
        false,
        true
      )
      : Task.FromResult<IEntry[]>([]);

    await Task.WhenAll(journalCandidatesTask, entryCandidatesTask);

    var rankedEntities = journalCandidatesTask.Result
      .Where(j => j.Id != source.OwnJournalId)
      .Select(j => new
        {
          Entity = new SearchResultEntity { EntityType = EntityType.Journal, Entity = j },
          Score = GetScore(words, j.Name, j.Description)
        }
      )
      .Concat(
        entryCandidatesTask.Result.Select(e => new
          {
            Entity = new SearchResultEntity { EntityType = EntityType.Entry, Entity = e },
            Score = GetScore(words, (e as ScrapsEntry)?.Title, e.Notes)
          }
        )
      )
      .OrderByDescending(x => x.Score)
      .ThenByDescending(x => x.Entity.Entity.EditedOn)
      .Take(query.Limit ?? DefaultResultLimit)
      .Select(x => x.Entity)
      .ToArray();

    var parentJournalIds = rankedEntities
      .Where(e => e.EntityType == EntityType.Entry)
      .Select(e => ((IEntry)e.Entity).ParentId)
      .ToArray();

    return new SearchEntitiesResult
    {
      Entities = rankedEntities,
      Journals = allJournals.Where(j => parentJournalIds.Contains(j.Id)).ToArray()
    };
  }

  // returns the text to derive the search words from, plus the id of the journal whose
  // items must be excluded (the source journal itself resp. the source entry's parent).
  // OwnJournalId == null means "source not accessible".
  private async Task<SourceContext> LoadSource(GetRelatedEntitiesQuery query)
  {
    if (query.EntityType == EntityType.Journal)
    {
      // GetJournal is permission-scoped and returns null if the user may not read it
      IJournal? journal = await journalRepository.GetJournal(query.EntityId!);
      return new SourceContext(journal?.Name, journal?.Id);
    }

    // GetEntry is an unscoped primitive, so read access is enforced here by loading the
    // parent journal through the scoped GetJournal (same pattern as GetEntryQueryExecutor).
    IEntry? entry = await entryRepository.GetEntry(query.EntityId!);
    if (entry == null)
    {
      return SourceContext.Inaccessible;
    }

    IJournal? parentJournal = await journalRepository.GetJournal(entry.ParentId);
    if (parentJournal == null)
    {
      return SourceContext.Inaccessible;
    }

    var title = (entry as ScrapsEntry)?.Title;
    return new SourceContext(string.IsNullOrWhiteSpace(title) ? entry.Notes : title, entry.ParentId);
  }

  private static string[] GetRelevantWords(string? text)
  {
    return Regex.Split((text ?? string.Empty).ToLowerInvariant(), @"[^\p{L}\p{N}]+")
      .Select(word => word.Trim())
      .Where(word => word.Length >= MinWordLength && !StopWords.Contains(word))
      .Distinct()
      .Take(MaxWords)
      .ToArray();
  }

  // title matches weigh more than body matches; every candidate matches at least one
  // word (the DB query selected it with the same WholeWordRegex pattern), so the
  // minimum score is 1.
  private static int GetScore(string[] words, string? title, string? body)
  {
    return words.Aggregate(
      0,
      (score, word) =>
        score + (WholeWordRegex.IsMatch(title, word) ? 3 : WholeWordRegex.IsMatch(body, word) ? 1 : 0)
    );
  }

  private sealed class SourceContext(string? sourceText, string? ownJournalId)
  {
    public static readonly SourceContext Inaccessible = new(null, null);

    public string? SourceText { get; } = sourceText;

    // null means the source does not exist or the current user must not see it
    public string? OwnJournalId { get; } = ownJournalId;
  }
}
