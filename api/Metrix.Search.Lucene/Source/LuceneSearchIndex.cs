using System.Text;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Queries;
using Lucene.Net.Queries.Function;
using Lucene.Net.Queries.Function.ValueSources;
using Lucene.Net.Search;
using Metrix.Core.Application.Search;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Search.Lucene;

// problems:
// - performance?
// - grouping
// - storing actual metric values instead of keys in index

public class LuceneSearchIndex : ISearchIndex
{
  public static readonly string countFieldName = "__count";
  public static readonly string uniqueValueFieldName = "__unique";

  private readonly MemoryLuceneIndex _index = new();

  public AttributeSearchResult[] Search(
    string searchText,
    Dictionary<string, MetricAttribute> attributes,
    params Dictionary<string, string[]>[] attributeValues
  )
  {
    Dictionary<string, Dictionary<string, string[]>> addDocumentsToIndex =
      AddDocumentsToIndex(attributes, attributeValues);

    Query query = CreateQuery(attributeValues, searchText);

    InternalSearchResult[] searchResults = _index.Search(query);

    return searchResults
      .Select(
        r => new AttributeSearchResult
        {
          Score = r.Score,
          OccurrenceCount = r.Occurrence,
          Values = addDocumentsToIndex[r.Key]
        }
      )
      .ToArray();
  }

  private static Query CreateQuery(Dictionary<string, string[]>[] metricAttributeValues, string searchText)
  {
    var query = new BooleanQuery();

    string[] searchTerms = searchText.Split(" ");

    foreach (string searchTerm in searchTerms)
    {
      var termQuery = new BooleanQuery();

      foreach (string fieldName in metricAttributeValues.SelectMany(v => v.Keys).Distinct())
      {
        termQuery.Clauses.Add(
          new BooleanClause(new TermQuery(new Term(fieldName, searchTerm)), Occur.SHOULD)
        );
        termQuery.Clauses.Add(
          new BooleanClause(new WildcardQuery(new Term(fieldName, searchTerm + "*")), Occur.SHOULD)
        );
        termQuery.Clauses.Add(
          new BooleanClause(new FuzzyQuery(new Term(fieldName, searchTerm)), Occur.SHOULD)
        );
      }

      // give a higher score when there's a high occurrence.
      Query modifiedQuery = new CustomScoreQuery(termQuery, new FunctionQuery(new Int32FieldSource(countFieldName)));

      query.Clauses.Add(new BooleanClause(modifiedQuery, Occur.MUST));
    }

    return query;
  }

  private Dictionary<string, Dictionary<string, string[]>> AddDocumentsToIndex(
    Dictionary<string, MetricAttribute> metricAttributes,
    IEnumerable<Dictionary<string, string[]>> metricAttributeValues
  )
  {
    Dictionary<string, Document> docsByUniqueString = new();
    Dictionary<string, Dictionary<string, string[]>> valuesByUniqueString = new();

    foreach (Dictionary<string, string[]> attributeValues in metricAttributeValues)
    {
      string uniqueValueString = GetUniqueValueString(attributeValues);

      if (docsByUniqueString.TryGetValue(uniqueValueString, out Document existingDoc))
      {
        int count = existingDoc.GetField(countFieldName).GetInt32Value() ?? 0;
        existingDoc.RemoveField(countFieldName);
        existingDoc.Add(new Int32Field(countFieldName, count + 1, Field.Store.YES));
      }
      else
      {
        Document document = CreateDocument(metricAttributes, attributeValues);
        document.Add(new Int32Field(countFieldName, 1, Field.Store.YES));
        document.Add(new StringField(uniqueValueFieldName, uniqueValueString, Field.Store.YES));

        docsByUniqueString.Add(uniqueValueString, document);
        valuesByUniqueString.Add(uniqueValueString, attributeValues);
      }
    }

    _index.AddDocuments(docsByUniqueString.Values);

    return valuesByUniqueString;
  }

  private static string GetUniqueValueString(Dictionary<string, string[]> attributeValues)
  {
    var sb = new StringBuilder();

    foreach (KeyValuePair<string, string[]> attributeValue in attributeValues.OrderBy(v => v.Key))
    {
      sb.Append($"{attributeValue.Key}:${string.Join(",", attributeValue.Value.OrderBy(v => v))};");
    }

    return sb.ToString();
  }

  private static Document CreateDocument(
    Dictionary<string, MetricAttribute> metricAttributes,
    Dictionary<string, string[]> attributeValues
  )
  {
    var document = new Document();

    foreach (KeyValuePair<string, string[]> attributeValue in attributeValues)
    {
      string attributeKey = attributeValue.Key;
      string[] valueKeys = attributeValue.Value;

      MetricAttribute? attribute = metricAttributes.ContainsKey(attributeKey) ? metricAttributes[attributeKey] : null;
      string[] labelValues = GetLabelValues(valueKeys, attribute);

      document.Add(new TextField(attributeKey, string.Join(",", labelValues), Field.Store.YES));
    }

    return document;
  }

  private static string[] GetLabelValues(string[] valueKeys, MetricAttribute? attribute)
  {
    return valueKeys
      .Select(
        valueKey => attribute != null && attribute.Values.TryGetValue(valueKey, out string value) ? value : valueKey
      )
      .ToArray();
  }
}
