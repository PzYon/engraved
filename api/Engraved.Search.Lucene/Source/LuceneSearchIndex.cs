using System.Text;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Queries;
using Lucene.Net.Queries.Function;
using Lucene.Net.Queries.Function.ValueSources;
using Lucene.Net.Search;
using Engraved.Core.Application.Search;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Search.Lucene;

public class LuceneSearchIndex : ISearchIndex
{
  public const string CountFieldName = "__count";
  public const string UniqueValueFieldName = "__unique";

  private readonly MemoryLuceneIndex _index = new();

  public static void WakeUp()
  {
    // touch a random index in order for all assemblies to be loaded and make first real request faster.
    Document tempDoc = CreateDocument(new Dictionary<string, MetricAttribute>(), new Dictionary<string, string[]>());
    var tempIndex = new MemoryLuceneIndex();
    tempIndex.AddDocuments(new List<Document> { tempDoc });
    tempIndex.Search(CreateQuery(Array.Empty<Dictionary<string, string[]>>(), string.Empty));
  }

  public AttributeSearchResult[] Search(
      string searchText,
      Dictionary<string, MetricAttribute> attributes,
      params Dictionary<string, string[]>[] attributeValues
    )
  {
    Dictionary<string, Dictionary<string, string[]>>
      documentsInIndex = AddDocumentsToIndex(attributes, attributeValues);

    Query query = CreateQuery(attributeValues, searchText);
    InternalSearchResult[] searchResults = _index.Search(query);

    return searchResults
      .Select(
        r => new AttributeSearchResult
        {
          Score = r.Score,
          OccurrenceCount = r.Occurrence,
          Values = documentsInIndex[r.Key]
        }
      )
      .ToArray();
  }

  private static Query CreateQuery(Dictionary<string, string[]>[] metricAttributeValues, string searchText)
  {
    var query = new BooleanQuery();

    foreach (string searchTerm in searchText.ToLower().Split(" "))
    {
      Query termQuery = GetQueryForTerm(metricAttributeValues, searchTerm);
      query.Clauses.Add(new BooleanClause(termQuery, Occur.MUST));
    }

    return query;
  }

  private static Query GetQueryForTerm(Dictionary<string, string[]>[] metricAttributeValues, string searchTerm)
  {
    var termQuery = new BooleanQuery();

    foreach (string fieldName in metricAttributeValues.SelectMany(v => v.Keys).Distinct())
    {
      termQuery.Clauses.Add(
        new BooleanClause(new TermQuery(new Term(fieldName, searchTerm)) { Boost = 2 }, Occur.SHOULD)
      );
      termQuery.Clauses.Add(
        new BooleanClause(new WildcardQuery(new Term(fieldName, searchTerm + "*")) { Boost = 1.5f }, Occur.SHOULD)
      );
      termQuery.Clauses.Add(
        new BooleanClause(new FuzzyQuery(new Term(fieldName, searchTerm)), Occur.SHOULD)
      );
    }

    // give a higher score when there's a high occurrence.
    return new CustomScoreQuery(termQuery, new FunctionQuery(new Int32FieldSource(CountFieldName)));
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

      if (docsByUniqueString.TryGetValue(uniqueValueString, out Document? existingDoc))
      {
        int count = existingDoc.GetField(CountFieldName).GetInt32Value() ?? 0;
        existingDoc.RemoveField(CountFieldName);
        existingDoc.Add(new Int32Field(CountFieldName, count + 1, Field.Store.YES));
      }
      else
      {
        Document document = CreateDocument(metricAttributes, attributeValues);
        document.Add(new Int32Field(CountFieldName, 1, Field.Store.YES));
        document.Add(new StringField(UniqueValueFieldName, uniqueValueString, Field.Store.YES));

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

      MetricAttribute? attribute = metricAttributes.TryGetValue(attributeKey, out MetricAttribute? metricAttribute)
        ? metricAttribute
        : null;

      string[] labelValues = GetLabelValues(valueKeys, attribute);

      document.Add(new TextField(attributeKey, string.Join(",", labelValues), Field.Store.YES));
    }

    return document;
  }

  private static string[] GetLabelValues(string[] valueKeys, MetricAttribute? attribute)
  {
    return valueKeys
      .Select(
        valueKey => attribute != null && attribute.Values.TryGetValue(valueKey, out string? value) ? value : valueKey
      )
      .ToArray();
  }
}
