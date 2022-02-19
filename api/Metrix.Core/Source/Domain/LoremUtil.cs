using System.Text;
using static System.String;

namespace Metrix.Core.Domain
{
  internal class LoremUtil
  {
    // https://stackoverflow.com/questions/4286487/is-there-any-lorem-ipsum-generator-in-c
    public static string LoremIpsum(int minWords, int maxWords, int minSentences, int maxSentences)
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

          result.Append(words[Random.Shared.Next(words.Length)]);
        }

        result.Append(". ");
      }

      return result.ToString();
    }
  }
}
