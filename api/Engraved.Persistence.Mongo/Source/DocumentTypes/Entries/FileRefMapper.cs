using Engraved.Core.Domain.Files;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public static class FileRefMapper
{
  public static FileRefSubDocument[] MapAttachments(FileRef[] attachments)
  {
    return attachments
      .Select(a => new FileRefSubDocument
        {
          Id = a.Id,
          FileName = a.FileName,
          ContentType = a.ContentType,
          Length = a.Length,
          Width = a.Width,
          Height = a.Height
        }
      )
      .ToArray();
  }

  public static FileRef[] MapAttachmentsFromDocument(FileRefSubDocument[] attachments)
  {
    return attachments
      .Select(a => new FileRef
        {
          Id = a.Id,
          FileName = a.FileName,
          ContentType = a.ContentType,
          Length = a.Length,
          Width = a.Width,
          Height = a.Height
        }
      )
      .ToArray();
  }
}
