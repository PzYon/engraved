using Engraved.Core.Domain.Entries;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public class ScrapsEntryDocument : EntryDocument
{
  public string? Title { get; set; }
  
  public ScrapType? ScrapType { get; set; }
}
