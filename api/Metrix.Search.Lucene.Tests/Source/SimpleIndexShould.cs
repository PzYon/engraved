using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace Metrix.Search.Lucene;

public class SimpleIndexShould
{
  [Test]
  public void MatchSingleTerm()
  {
    List<Dictionary<string, string[]>> search = new SimpleIndexWrapper().Search(
      "red",
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(search);
    Assert.AreEqual(2, search.Count);
  }

  [Test]
  public void MatchMultipleTerms()
  {
    List<Dictionary<string, string[]>> search = new SimpleIndexWrapper().Search(
      "red beta",
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(search);
    Assert.AreEqual(1, search.Count);
  }

  private IEnumerable<Dictionary<string, string[]>> GetSimpleValues()
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
