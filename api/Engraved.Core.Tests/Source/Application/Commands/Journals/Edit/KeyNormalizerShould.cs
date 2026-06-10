using System.Collections.Generic;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Journals.Edit;

public class KeyNormalizerShould
{
  [TestCase(",")]
  [TestCase(";")]
  [TestCase("?")]
  [TestCase(":")]
  [TestCase("=")]
  public void ReplaceInvalidChar_With_Underscore(string invalidChar)
  {
    Dictionary<string, int> result = KeyNormalizer.Normalize(
      new Dictionary<string, int> { { $"a{invalidChar}b", 1 } }
    );

    result.Should().ContainKey("a_b").WhoseValue.Should().Be(1);
  }

  [Test]
  public void ReplaceMultipleInvalidChars_InSameKey()
  {
    Dictionary<string, int> result = KeyNormalizer.Normalize(
      new Dictionary<string, int> { { "a,b;c=d", 42 } }
    );

    result.Should().ContainKey("a_b_c_d").WhoseValue.Should().Be(42);
  }

  [Test]
  public void LeaveCleanKeysUntouched()
  {
    Dictionary<string, string> result = KeyNormalizer.Normalize(
      new Dictionary<string, string> { { "clean-key", "value" } }
    );

    result.Should().ContainKey("clean-key").WhoseValue.Should().Be("value");
  }
}
