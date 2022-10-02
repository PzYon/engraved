using System.Text;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Queries;
using Lucene.Net.Queries.Function;
using Lucene.Net.Queries.Function.ValueSources;
using Lucene.Net.Search;
using Metrix.Core.Application.Search;

namespace Metrix.Search.Lucene;

// problems:
// - performance?
// - grouping
// - storing actual metric values instead of keys in index

public class LuceneSearchIndex : ISearchIndex
{
  private static readonly string countFieldName = "__count";

  private readonly MemoryLuceneIndex _index = new();

  public List<Dictionary<string, string[]>> Search(
    string searchText,
    params Dictionary<string, string[]>[] metricAttributeValues
    )
  {
    AddDocumentsToIndex(metricAttributeValues);

    Query query = CreateQuery(metricAttributeValues, searchText);

    return _index.Search(query);
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

  private void AddDocumentsToIndex(IEnumerable<Dictionary<string, string[]>> metricAttributeValues)
  {
    Dictionary<string, Document> docs = new();

    foreach (Dictionary<string, string[]> attributeValues in metricAttributeValues)
    {
      string uniqueValueString = GetUniqueValueString(attributeValues);

      if (docs.TryGetValue(uniqueValueString, out Document existingDoc))
      {
        int count = existingDoc.GetField(countFieldName).GetInt32Value() ?? 0;
        existingDoc.RemoveField(countFieldName);
        existingDoc.Add(new Int32Field(countFieldName, count + 1, Field.Store.YES));
      }
      else
      {
        Document document = CreateDocument(attributeValues);
        document.Add(new Int32Field(countFieldName, 1, Field.Store.YES));
        docs.Add(uniqueValueString, document);
      }
    }

    _index.AddDocuments(docs.Values);
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

  private static Document CreateDocument(Dictionary<string, string[]> attributeValues)
  {
    var document = new Document();

    foreach (KeyValuePair<string, string[]> attributeValue in attributeValues)
    {
      document.Add(new TextField(attributeValue.Key, string.Join(",", attributeValue.Value), Field.Store.YES));
    }

    return document;
  }
}
