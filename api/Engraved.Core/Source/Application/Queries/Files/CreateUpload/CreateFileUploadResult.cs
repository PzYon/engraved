using Engraved.Core.Domain.Files;

namespace Engraved.Core.Application.Queries.Files.CreateUpload;

public class CreateFileUploadResult
{
  // To be put on the entry's Attachments by the client and saved with the entry.
  public FileRef File { get; set; } = null!;

  public string UploadUrl { get; set; } = null!;

  // Handed out together with the upload URL so the client can display the file immediately. Asking
  // for it via GetFileUrlQuery would not work yet: nothing references the file until the entry is
  // saved, and that query resolves permissions through the owning entry.
  public string ReadUrl { get; set; } = null!;
}
