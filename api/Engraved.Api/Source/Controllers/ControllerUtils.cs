using Engraved.Core.Domain.Journals;

namespace Engraved.Api.Controllers;

public static class ControllerUtils
{
  public static JournalType[] ParseJournalTypes(string? journalTypes)
  {
    return ParseMultiValueStringParam(journalTypes)
      .Select(Enum.Parse<JournalType>)
      .ToArray();
  }

  public static string[] ParseMultiValueStringParam(string? parameterString)
  {
    return string.IsNullOrEmpty(parameterString)
      ? []
      : parameterString.Split(",")
        .Select(t => t.Trim())
        .ToArray();
  }
}
