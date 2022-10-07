using System.Collections.Generic;
using System.Linq;
using Lucene.Net.Analysis.Hunspell;
using Metrix.Core.Application.Search;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Search.Lucene;

public class LuceneSearchIndexShould
{
  [Test]
  public void MatchSingleTerm()
  {
    List<SearchResult> results = new LuceneSearchIndex().Search(
      "red",
      new(),
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(2, results.Count);
  }

  [Test]
  public void MatchMultipleTerms()
  {
    List<SearchResult> results = new LuceneSearchIndex().Search(
      "red beta",
      new(),
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(1, results.Count);
  }

  [Test]
  public void ReturnOnlyDistinctResults()
  {
    List<SearchResult> results = new LuceneSearchIndex().Search(
      "red beta",
      new(),
      GetSimpleValues().Union(GetSimpleValues()).Union(GetSimpleValues()).ToArray()
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(1, results.Count);
  }

  [Test]
  public void ReturnOnlyDistinctResultsWeightedBasedOnOccurrence()
  {
    List<SearchResult> results = new LuceneSearchIndex().Search(
      "occurs",
      new(),
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Once" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Twice" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Twice" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } }
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(3, results.Count);

    Assert.AreEqual("Occurs Three Times", results.ToArray()[0].Values["attr1"][0]);
    Assert.AreEqual("Occurs Twice", results.ToArray()[1].Values["attr1"][0]);
    Assert.AreEqual("Occurs Once", results.ToArray()[2].Values["attr1"][0]);
  }

  [Test]
  public void ConsiderMetricAttributeValuesIfAvailable()
  {
    Dictionary<string, MetricAttribute> metricAttributes = new()
    {
      {
        "fruit",
        new MetricAttribute
        {
          Name = "Fruit",
          Values = new Dictionary<string, string>
          {
            { "yellow", "Banana" },
            { "banana", "Yellow" }
          }
        }
      }
    };

    List<SearchResult> results = new LuceneSearchIndex().Search(
      "banana",
      metricAttributes,
      new Dictionary<string, string[]>
      {
        { "fruit", new[] { "yellow" } }
      },
      new Dictionary<string, string[]>
      {
        { "fruit", new[] { "banana" } }
      }
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(1, results.Count);
    Assert.AreEqual(results.First().Values["fruit"].First(), "yellow");
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
      { "attr2", new[] { "Black" } }
    };
  }
}
