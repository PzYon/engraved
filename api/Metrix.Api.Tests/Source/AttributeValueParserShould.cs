using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace Metrix.Api.Tests;

public class AttributeValueParserShould
{
  [Test]
  public void Parse_SimpleKeyValuePair()
  {
    IDictionary<string, string[]> attributeValues = AttributeValueParser.Parse("color:blue;");
    Assert.AreEqual("blue", attributeValues["color"].First());
  }

  [Test]
  public void Parse_KeyValuePairWithMultipleValues()
  {
    IDictionary<string, string[]> attributeValues = AttributeValueParser.Parse("color:blue,yellow");
    Assert.AreEqual("blue", attributeValues["color"][0]);
    Assert.AreEqual("yellow", attributeValues["color"][1]);
  }

  [Test]
  public void Parse_MultipleKeyValuePairs()
  {
    IDictionary<string, string[]> attributeValues = AttributeValueParser.Parse("color:blue;size:XL");
    Assert.AreEqual("blue", attributeValues["color"][0]);
    Assert.AreEqual("XL", attributeValues["size"][0]);
  }
}
