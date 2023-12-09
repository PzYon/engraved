using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Api.Tests;

public class AttributeValueParserShould
{
  [Test]
  public void Parse_SimpleKeyValuePair()
  {
    IDictionary<string, string[]> attributeValues = AttributeValueParser.Parse("color:blue;");
    attributeValues["color"].First().Should().Be("blue");
  }

  [Test]
  public void Parse_KeyValuePairWithMultipleValues()
  {
    IDictionary<string, string[]> attributeValues = AttributeValueParser.Parse("color:blue,yellow");

    attributeValues["color"][0].Should().Be("blue");
    attributeValues["color"][1].Should().Be("yellow");
  }

  [Test]
  public void Parse_MultipleKeyValuePairs()
  {
    IDictionary<string, string[]> attributeValues = AttributeValueParser.Parse("color:blue;size:XL");
    attributeValues["color"][0].Should().Be("blue");
    attributeValues["size"][0].Should().Be("XL");
  }
}
