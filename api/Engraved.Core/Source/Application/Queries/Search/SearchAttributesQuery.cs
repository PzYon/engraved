using Engraved.Core.Application.Search;

namespace Engraved.Core.Application.Queries.Search;

public class SearchAttributesQuery : IQuery<AttributeSearchResult[]>
{
  public string MetricId { get; set; } = null!;

  public string SearchText { get; set; } = null!;

  // hack - this stuff should be injected via DI
  private ISearchIndex _searchIndex = null!;
  private Dispatcher _dispatcher = null!;

  public IQueryExecutor<AttributeSearchResult[]> CreateExecutor()
  {
    return new SearchAttributesQueryExecutor(this);
  }

  public void SetSearchIndex(ISearchIndex searchIndex)
  {
    _searchIndex = searchIndex;
  }

  public ISearchIndex GetSearchIndex()
  {
    return _searchIndex;
  }

  public void SetDispatcher(Dispatcher dispatcher)
  {
    _dispatcher = dispatcher;
  }

  public Dispatcher GetDispatcher()
  {
    return _dispatcher;
  }
}
