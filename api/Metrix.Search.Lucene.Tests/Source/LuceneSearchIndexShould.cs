using System.Collections.Generic;
using System.Linq;
using Metrix.Core.Application.Search;
using Metrix.Core.Domain.Metrics;
using NUnit.Framework;

namespace Metrix.Search.Lucene;

public class LuceneSearchIndexShould
{
  [Test]
  public void MatchSingleTerm()
  {
    AttributeSearchResult[] results = new LuceneSearchIndex().Search(
      "red",
      new Dictionary<string, MetricAttribute>(),
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(2, results.Length);
  }

  [Test]
  public void MatchMultipleTerms()
  {
    AttributeSearchResult[] results = new LuceneSearchIndex().Search(
      "red beta",
      new Dictionary<string, MetricAttribute>(),
      GetSimpleValues().ToArray()
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(1, results.Length);
  }

  [Test]
  public void ReturnOnlyDistinctResults()
  {
    AttributeSearchResult[] results = new LuceneSearchIndex().Search(
      "red beta",
      new Dictionary<string, MetricAttribute>(),
      GetSimpleValues().Union(GetSimpleValues()).Union(GetSimpleValues()).ToArray()
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(1, results.Length);
  }

  [Test]
  public void ReturnOnlyDistinctResultsWeightedBasedOnOccurrence()
  {
    AttributeSearchResult[] results = new LuceneSearchIndex().Search(
      "occurs",
      new Dictionary<string, MetricAttribute>(),
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Once" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Twice" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Twice" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } }
    );

    Assert.IsNotEmpty(results);
    Assert.AreEqual(3, results.Length);

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

    AttributeSearchResult[] results = new LuceneSearchIndex().Search(
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
    Assert.AreEqual(1, results.Length);
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
