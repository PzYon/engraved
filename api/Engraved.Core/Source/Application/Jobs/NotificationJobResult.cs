namespace Engraved.Core.Application.Jobs;

public class NotificationJobResult
{
  public Dictionary<string, List<string>> NotifiedJournalIdsByUser { get; } = [];
  public Dictionary<string, List<string>> NotifiedEntryIdsByUser { get; } = [];

  public void AddJournal(string userName, string journalId)
  {
    if (!NotifiedJournalIdsByUser.ContainsKey(userName))
    {
      NotifiedJournalIdsByUser[userName] = [];
    }

    NotifiedJournalIdsByUser[userName].Add(journalId);
  }

  public void AddEntry(string userName, string entryId)
  {
    if (!NotifiedEntryIdsByUser.ContainsKey(userName))
    {
      NotifiedEntryIdsByUser[userName] = [];
    }

    NotifiedEntryIdsByUser[userName].Add(entryId);
  }
}
