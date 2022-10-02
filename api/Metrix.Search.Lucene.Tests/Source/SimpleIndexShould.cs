using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace Metrix.Search.Lucene;

public class SimpleIndexShould
{
  [Test]
  public void MatchSingleTerm()
  {
    List<Dictionary<string, string[]>> search = new LuceneSearchIndex().Search(
      "red",
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(search);
    Assert.AreEqual(2, search.Count);
  }

  [Test]
  public void MatchMultipleTerms()
  {
    List<Dictionary<string, string[]>> search = new LuceneSearchIndex().Search(
      "red beta",
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(search);
    Assert.AreEqual(1, search.Count);
  }

  [Test]
  public void ReturnOnlyDistinctResults()
  {
    List<Dictionary<string, string[]>> search = new LuceneSearchIndex().Search(
      "red beta",
      GetSimpleValues().Union(GetSimpleValues()).Union(GetSimpleValues()).ToArray()
    );

    Assert.IsNotEmpty(search);
    Assert.AreEqual(1, search.Count);
  }

  private static IEnumerable<Dictionary<string, string[]>> GetSimpleValues()
  {
    yield return new Dictionary<string, string[]>
    {
      { "attr1", new[] { "Alpha" } },
      { "attr2", new[] { "Red" } }
    };

    yield return new Dictionary<string, string[]>
    {
      { "attr1", new[] { "Beta" } },
      { "attr2", new[] { "Red" } }
    };

    yield return new Dictionary<string, string[]>
    {
      { "attr1", new[] { "Alpha" } },
      { "attr2", new[] { "Blac" } }
    };
  }
}
