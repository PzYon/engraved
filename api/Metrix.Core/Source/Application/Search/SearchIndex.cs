namespace Metrix.Core.Application.Search;

public interface ISearchIndex
{
  List<Dictionary<string, string[]>> Search(
    string searchText,
    params Dictionary<string, string[]>[] metricAttributeValues
    );
}
