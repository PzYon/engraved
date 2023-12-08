using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application.Queries.Search;

public interface ISearchIndex
{
  SearchAttributesResult[] Search(
    string searchText,
    Dictionary<string, JournalAttribute> attributes,
    params Dictionary<string, string[]>[] attributeValues
  );
}
