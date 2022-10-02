namespace Metrix.Core.Application.Search;

public interface ISearchIndex
{
  List<SearchResult> Search(
    string searchText,
    params Dictionary<string, string[]>[] metricAttributeValues
    );
}
