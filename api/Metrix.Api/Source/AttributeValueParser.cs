namespace Metrix.Api;

public static class AttributeValueParser
{
  public static IDictionary<string, string[]> Parse(string? attributeValues)
  {
    var dict = new Dictionary<string, string[]>();

    if (string.IsNullOrEmpty(attributeValues))
    {
      return dict;
    }
    
    foreach (string s in attributeValues.Split(";", StringSplitOptions.RemoveEmptyEntries))
    {
      string[] strings = s.Split(":");
      string attributeKey = strings[0];
      string[] values = strings[1].Split(",", StringSplitOptions.RemoveEmptyEntries);

      dict.Add(attributeKey, values);
    }

    return dict;
  }
}
