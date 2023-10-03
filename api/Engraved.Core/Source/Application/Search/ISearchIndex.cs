using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Search;

public interface ISearchIndex
{
  AttributeSearchResult[] Search(
    string searchText,
    Dictionary<string, JournalAttribute> attributes,
    params Dictionary<string, string[]>[] attributeValues
  );
}
