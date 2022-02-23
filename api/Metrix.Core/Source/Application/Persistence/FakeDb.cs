﻿using System.Text;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Persistence;

public class FakeDb : IDb
{
  public List<Measurement> Measurements { get; } = new();

  public List<Metric> Metrics { get; }

  public FakeDb()
  {
    Metrics = Enumerable.Range(0, Random.Shared.Next(5, 30))
      .Select(i => new Metric
      {
        Description = LoremIpsum(0, 12, 1, 3),
        Key = "key" + i,
        Name = LoremIpsum(1, 3, 1, 1),
        Type = MetricType.Gauge,
        Unit = "kg"
      })
      .ToList();

    foreach (var metric in Metrics)
    {
      Measurements.AddRange(Enumerable.Range(0, Random.Shared.Next(5, 20))
        .Select(_ => new Measurement
        {
          DateTime = GetRandomDate(),
          MetricKey = metric.Key,
          Value = GetValue(),
          Notes = Random.Shared.Next(1, 3) > 1 ? LoremIpsum(3, 15, 1, 4) : string.Empty
        })
        .OrderBy(m => m.DateTime)
        .ToList());
    }
  }

  private static DateTime GetRandomDate()
  {
    return DateTime.UtcNow.AddSeconds(-Random.Shared.Next(1000, 100000));
  }

  private static int GetValue()
  {
    return Random.Shared.Next(10, 40);
  }

  // https://stackoverflow.com/questions/4286487/is-there-any-lorem-ipsum-generator-in-c
  private static string LoremIpsum(int minWords, int maxWords, int minSentences, int maxSentences)
  {
    var words = new[]
    {
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetuer",
      "adipiscing", "elit", "sed", "diam", "nonummy", "nibh", "euismod",
      "tincidunt", "ut", "laoreet", "dolore", "magna", "aliquam", "erat"
    };

    int numSentences = Random.Shared.Next(minSentences, maxSentences);
    int numWords = Random.Shared.Next(minWords, maxWords);

    if (numWords == 0 || numSentences == 0)
    {
      return string.Empty;
    }

    StringBuilder result = new StringBuilder();

    for (int s = 0; s < numSentences; s++)
    {
      for (int w = 0; w < numWords; w++)
      {
        if (w > 0)
        {
          result.Append(" ");
        }

        result.Append(words[Random.Shared.Next(words.Length)]);
      }

      result.Append(". ");
    }

    return result.ToString();
  }
}
