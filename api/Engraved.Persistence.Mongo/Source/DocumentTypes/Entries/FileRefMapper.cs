using Engraved.Core.Domain.Files;

namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public static class FileRefMapper
{
  public static FileRefSubDocument[] MapFiles(FileRef[] files)
  {
    return files
      .Select(f => new FileRefSubDocument
        {
          Id = f.Id,
          FileName = f.FileName,
          ContentType = f.ContentType,
          ContentLength = f.ContentLength,
          UploadedOn = f.UploadedOn,
          Width = f.Width,
          Height = f.Height
        }
      )
      .ToArray();
  }

  public static FileRef[] MapFilesFromDocument(FileRefSubDocument[] files)
  {
    return files
      .Select(f => new FileRef
        {
          Id = f.Id,
          FileName = f.FileName,
          ContentType = f.ContentType,
          ContentLength = f.ContentLength,
          UploadedOn = f.UploadedOn,
          Width = f.Width,
          Height = f.Height
        }
      )
      .ToArray();
  }
}
