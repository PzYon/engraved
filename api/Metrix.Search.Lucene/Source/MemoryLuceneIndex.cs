using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.Util;
using Metrix.Core.Application.Search;

namespace Metrix.Search.Lucene;

public class MemoryLuceneIndex
{
  private const LuceneVersion LuceneVersion = global::Lucene.Net.Util.LuceneVersion.LUCENE_48;

  private IndexWriter _indexWriter;
  private RAMDirectory _directory;

  public MemoryLuceneIndex()
  {
    _directory = new RAMDirectory();

    Analyzer analyzer = new StandardAnalyzer(LuceneVersion);
    var config = new IndexWriterConfig(LuceneVersion, analyzer);
    _indexWriter = new IndexWriter(_directory, config);
  }

  public void AddDocuments(IEnumerable<Document> docs)
  {
    _indexWriter.AddDocuments(docs);
    _indexWriter.Commit();
  }

  public List<SearchResult> Search(Query query)
  {
    DirectoryReader? dirReader = DirectoryReader.Open(_directory);

    var searcher = new IndexSearcher(dirReader);

    ScoreDoc[] scoreDocs = searcher.Search(query, null, 10).ScoreDocs;

    var results = new List<SearchResult>();

    foreach (ScoreDoc scoreDoc in scoreDocs)
    {
      Document d = searcher.Doc(scoreDoc.Doc);

      var fieldValues = new Dictionary<string, string[]>();
      foreach (IIndexableField field in d.Fields)
      {
        // todo: skip __ and co.

        fieldValues[field.Name] = field.GetStringValue().Split(",");
      }

      results.Add(
        new SearchResult
        {
          Values = fieldValues,
          OccurrenceCount = d.GetField("__count").GetInt32Value() ?? 1,
          Score = scoreDoc.Score
        }
      );
    }

    return results;
  }
}
