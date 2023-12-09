using Engraved.Core.Application.Queries.Search;
using Engraved.Core.Application.Queries.Search.Attributes;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Lucene.Net.Util;

namespace Engraved.Search.Lucene;

public class MemoryLuceneIndex
{
  private const LuceneVersion LuceneVersion = global::Lucene.Net.Util.LuceneVersion.LUCENE_48;

  private readonly RAMDirectory _directory;
  private readonly IndexWriter _indexWriter;

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

  public InternalSearchResult[] Search(Query query)
  {
    DirectoryReader? dirReader = DirectoryReader.Open(_directory);

    var searcher = new IndexSearcher(dirReader);

    ScoreDoc[] scoreDocs = searcher.Search(query, null, 10).ScoreDocs;

    return scoreDocs
      .Select(
        scoreDoc =>
        {
          Document? d = searcher.Doc(scoreDoc.Doc);

          return new InternalSearchResult
          {
            Key = d.GetField(LuceneSearchIndex.UniqueValueFieldName).GetStringValue(),
            Occurrence = d.GetField(LuceneSearchIndex.CountFieldName).GetInt32Value() ?? 0,
            Score = scoreDoc.Score
          };
        }
      )
      .ToArray();
  }
}
