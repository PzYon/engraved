using System.Text;
using static System.String;

namespace Metrix.Core.Domain;

public class DummyMetricsLoader : IMetricsLoader
{
  public Metric[] GetMetrics()
  {
    return Enumerable.Range(0, Random.Shared.Next(5, 30))
      .Select(i => new Metric
      {
        Description = LoremIpsum(0, 12, 1, 3),
        Key = "key" + i,
        Name = LoremIpsum(1, 3, 1, 1),
        Type = MetricType.Gauge,
        Unit = "kg"
      })
      .ToArray();
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

    var rand = new Random();
    int numSentences = rand.Next(minSentences,  maxSentences);
    int numWords = rand.Next(minWords, maxWords);

    if (numWords == 0 || numSentences == 0)
    {
      return Empty;
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

        result.Append(words[rand.Next(words.Length)]);
      }

      result.Append(". ");
    }

    return result.ToString();
  }
}