using Engraved.Core.Domain.Journals;

namespace Engraved.Api.Controllers;

public static class ControllerUtils
{
  public static JournalType[]? ParseJournalTypes(string? journalTypes)
  {
    if (string.IsNullOrEmpty(journalTypes))
    {
      return null;
    }

    return journalTypes.Split(",")
      .Select(Enum.Parse<JournalType>)
      .ToArray();
  }
}
