using System.Collections.Generic;
using Engraved.Core.Application.Commands.Journals.Edit;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Journals.Edit;

public class KeyNormalizerShould
{
  [TestCase(",")]
  [TestCase(";")]
  [TestCase("?")]
  [TestCase(":")]
  [TestCase("=")]
  public void ReplaceInvalidChar_With_Underscore(string invalidChar)
  {
    var result = KeyNormalizer.Normalize(
      new Dictionary<string, int> { { $"a{invalidChar}b", 1 } }
    );

    result.Should().ContainKey("a_b").WhoseValue.Should().Be(1);
  }

  [Test]
  public void ReplaceMultipleInvalidChars_InSameKey()
  {
    var result = KeyNormalizer.Normalize(
      new Dictionary<string, int> { { "a,b;c=d", 42 } }
    );

    result.Should().ContainKey("a_b_c_d").WhoseValue.Should().Be(42);
  }

  [Test]
  public void LeaveCleanKeysUntouched()
  {
    var result = KeyNormalizer.Normalize(
      new Dictionary<string, string> { { "clean-key", "value" } }
    );

    result.Should().ContainKey("clean-key").WhoseValue.Should().Be("value");
  }
}
