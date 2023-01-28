using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Search;

public interface ISearchIndex
{
  AttributeSearchResult[] Search(
    string searchText,
    Dictionary<string, MetricAttribute> attributes,
    params Dictionary<string, string[]>[] attributeValues
  );
}
