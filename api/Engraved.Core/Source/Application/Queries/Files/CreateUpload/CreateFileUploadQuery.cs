namespace Engraved.Core.Application.Queries.Files.CreateUpload;

// A query, not a command, because nothing is persisted: it mints time-bound URLs for a file id the
// caller has not uploaded yet. The FileRef only reaches the database once the client puts it on an
// entry and saves that entry.
public class CreateFileUploadQuery : IQuery
{
  public string? JournalId { get; set; }

  public string? FileName { get; set; }

  public string? ContentType { get; set; }

  public long Length { get; set; }

  public int? Width { get; set; }

  public int? Height { get; set; }
}
