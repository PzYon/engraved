using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.Util;

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

  public void AddDocument(Document doc)
  {
    _indexWriter.AddDocument(doc);
    _indexWriter.Commit();
  }

  public List<Dictionary<string, string[]>> Search(Query query)
  {
    DirectoryReader? dirReader = DirectoryReader.Open(_directory);

    var searcher = new IndexSearcher(dirReader);

    ScoreDoc[] scoreDocs = searcher.Search(query, null, 10).ScoreDocs;

    var results = new List<Dictionary<string, string[]>>();
    foreach (ScoreDoc scoreDoc in scoreDocs)
    {
      Document d = searcher.Doc(scoreDoc.Doc);

      var fieldValues = new Dictionary<string, string[]>();
      foreach (IIndexableField field in d.Fields)
      {
        fieldValues[field.Name] = field.GetStringValue().Split(",");
      }

      results.Add(fieldValues);
    }

    return results;
  }
}
