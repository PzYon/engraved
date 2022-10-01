using Lucene.Net.Analysis.En;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers.Classic;
using Lucene.Net.Search;
using Lucene.Net.Util;

namespace Metrix.Search.Lucene;

public class SimpleIndexWrapper
{
  private readonly SimpleIndex _index = new();

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
        // consider also adding fuzzy query here
        termQuery.Clauses.Add(new BooleanClause(new TermQuery(new Term(fieldName, searchTerm)), Occur.SHOULD));
      }

      query.Clauses.Add(new BooleanClause(termQuery, Occur.MUST));
    }

    return query;
  }

  private void AddDocumentsToIndex(IEnumerable<Dictionary<string, string[]>> metricAttributeValues)
  {
    foreach (Dictionary<string, string[]> attributeValues in metricAttributeValues)
    {
      Document document = CreateDocument(attributeValues);
      _index.AddDocument(document);
    }
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
