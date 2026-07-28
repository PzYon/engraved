namespace Engraved.Persistence.Mongo.DocumentTypes.Entries;

public class FileRefSubDocument
{
  public string Id { get; set; } = null!;

  public string FileName { get; set; } = null!;

  public string ContentType { get; set; } = null!;

  public long ContentLength { get; set; }

  public DateTime? UploadedOn { get; set; }

  public int? Width { get; set; }

  public int? Height { get; set; }
}
