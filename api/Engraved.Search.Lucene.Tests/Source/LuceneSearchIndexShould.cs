using System.Collections.Generic;
using System.Linq;
using Engraved.Core.Application.Queries.Search;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Search.Lucene;

public class LuceneSearchIndexShould
{
  [Test]
  public void MatchSingleTerm()
  {
    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "red",
      new Dictionary<string, JournalAttribute>(),
      GetSimpleValues().ToArray()
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(2);
  }

  [Test]
  public void MatchMultipleTerms()
  {
    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "red beta",
      new Dictionary<string, JournalAttribute>(),
      GetSimpleValues().ToArray()
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(1);
  }

  [Test]
  public void ReturnOnlyDistinctResults()
  {
    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "red beta",
      new Dictionary<string, JournalAttribute>(),
      GetSimpleValues().Union(GetSimpleValues()).Union(GetSimpleValues()).ToArray()
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(1);
  }

  [Test]
  public void ReturnOnlyDistinctResultsWeightedBasedOnOccurrence()
  {
    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "occurs",
      new Dictionary<string, JournalAttribute>(),
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Once" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Twice" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Twice" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "Occurs Three Times" } } }
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(3);

    results.ToArray()[0].Values["attr1"][0].Should().Be("Occurs Three Times");
    results.ToArray()[1].Values["attr1"][0].Should().Be("Occurs Twice");
    results.ToArray()[2].Values["attr1"][0].Should().Be("Occurs Once");
  }

  [Test]
  public void ConsiderJournalAttributeValuesIfAvailable()
  {
    Dictionary<string, JournalAttribute> journalAttributes = new()
    {
      {
        "fruit",
        new JournalAttribute
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

    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "banana",
      journalAttributes,
      new Dictionary<string, string[]>
      {
        { "fruit", new[] { "yellow" } }
      },
      new Dictionary<string, string[]>
      {
        { "fruit", new[] { "banana" } }
      }
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(1);
    results.First().Values["fruit"].First().Should().Be("yellow");
  }

  [Test]
  public void MatchWordsFromOneAttribute()
  {
    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "ten play",
      new Dictionary<string, JournalAttribute>(),
      new Dictionary<string, string[]> { { "attr1", new[] { "tennis player" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "tennisplayer" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "gu gu" } } },
      new Dictionary<string, string[]> { { "attr1", new[] { "ten play" } } }
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(2);
  }

  [Test]
  public void MatchWordsFromMultipleAttributes()
  {
    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "ten play",
      new Dictionary<string, JournalAttribute>(),
      new Dictionary<string, string[]>
      {
        { "attr1", new[] { "tennis" } },
        { "attr2", new[] { "gugu" } },
        { "attr3", new[] { "player" } }
      },
      new Dictionary<string, string[]>
      {
        { "attr1", new[] { "ten" } },
        { "attr2", new[] { "gu" } },
        { "attr3", new[] { "play" } }
      }
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(2);
  }

  [Test]
  public void IgnoreCasing()
  {
    SearchAttributesResult[] results = new LuceneSearchIndex().Search(
      "tAb TEst",
      new Dictionary<string, JournalAttribute>(),
      new Dictionary<string, string[]>
      {
        { "attr1", new[] { "Table" } },
        { "attr2", new[] { "TEST" } },
        { "attr3", new[] { "bla" } }
      },
      new Dictionary<string, string[]>
      {
        { "attr1", new[] { "table" } },
        { "attr2", new[] { "tEsT" } },
        { "attr3", new[] { "bla bla" } }
      }
    );

    results.Should().NotBeEmpty();
    results.Length.Should().Be(2);
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
