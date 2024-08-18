﻿using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Journals.GetThresholdValues;

// todo:
// - consider a specific time period for threshold (must be configured and
//   used in calculations)

public class GetThresholdValuesQueryExecutor(IUserScopedRepository repository)
  : IQueryExecutor<IDictionary<string, IDictionary<string, ThresholdResult>>,
    GetThresholdValuesQuery>
{
  public bool DisableCache => false;

  public async Task<IDictionary<string, IDictionary<string, ThresholdResult>>> Execute(GetThresholdValuesQuery query)
  {
    var journalQuery = new GetJournalQuery { JournalId = query.JournalId };
    var journalQueryExecutor = new GetJournalQueryExecutor(repository);

    IJournal? journal = await journalQueryExecutor.Execute(journalQuery);

    if (journal == null || journal.Thresholds.Count == 0)
    {
      return new Dictionary<string, IDictionary<string, ThresholdResult>>();
    }

    IEntry[] entries = await repository.GetEntriesForJournal(
      query.JournalId!,
      query.FromDate,
      query.ToDate
    );

    return CalculateThresholds(journal, entries);
  }

  private static IDictionary<string, IDictionary<string, ThresholdResult>> CalculateThresholds(
    IJournal journal,
    IEntry[] entries
  )
  {
    Dictionary<string, IDictionary<string, ThresholdResult>> results = new();

    foreach ((string? attributeKey, Dictionary<string, ThresholdDefinition>? thresholds) in journal.Thresholds)
    {
      Dictionary<string, ThresholdResult> attributeResults = new();

      foreach ((string? attributeValueKey, ThresholdDefinition definition) in thresholds)
      {
        double total = entries
          .Where(
            m =>
            {
              if (attributeKey == "-")
              {
                return true;
              }
              
              return m.JournalAttributeValues.TryGetValue(attributeKey, out string[]? valueKeys)
                     && valueKeys.Contains(attributeValueKey);
            }
          )
          .Sum(m => m.GetValue());

        attributeResults.Add(
          attributeValueKey,
          new ThresholdResult
          {
            ActualValue = total,
            ThresholdDefinition = definition
          }
        );
      }

      if (attributeResults.Count > 0)
      {
        results.Add(attributeKey, attributeResults);
      }
    }

    return results;
  }
}
