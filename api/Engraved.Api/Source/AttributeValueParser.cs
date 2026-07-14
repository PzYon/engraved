namespace Engraved.Api;

public static class AttributeValueParser
{
  public static IDictionary<string, string[]> Parse(string? attributeValues)
  {
    var dict = new Dictionary<string, string[]>();

    if (string.IsNullOrEmpty(attributeValues))
    {
      return dict;
    }

    foreach (var s in attributeValues.Split(";", StringSplitOptions.RemoveEmptyEntries))
    {
      var strings = s.Split(":");
      var attributeKey = strings[0];
      var values = strings[1].Split(",", StringSplitOptions.RemoveEmptyEntries);

      dict.Add(attributeKey, values);
    }

    return dict;
  }
}
