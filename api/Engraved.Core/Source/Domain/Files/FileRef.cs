namespace Engraved.Core.Domain.Files;

// A reference to a file owned by an entry - the metadata, not the bytes, which live in the file
// store. Denormalized onto the entry (rather than kept in its own collection) so rendering a list of
// entries never needs a second lookup to show file names and sizes.
//
// Named FileRef rather than File both because that is what it is, and because a domain type called
// File cannot compile here: ImplicitUsings pulls in System.IO, so the name is ambiguous. The same
// reason JournalAttribute is not called Attribute.
//
// Id is also the blob's name in the file store, and it is the only thing the blob knows about
// itself: the blob path must contain nothing that can change, because blob storage has no rename -
// what looks like a move is copy-then-delete. Every mutable relationship (which entry, which
// journal) lives here in the database instead.
public class FileRef
{
  public string Id { get; set; } = null!;

  public string FileName { get; set; } = null!;

  public string ContentType { get; set; } = null!;

  public long ContentLength { get; set; }

  // Stamped by the server when the file is accepted onto an entry - never taken from the client. A
  // FileRef travels out to the client at upload and comes back at save, so anything on it is
  // client-supplied by the time it is persisted, and a timestamp that can be set by the caller is
  // worse than none at all. Nullable because files stored before that stamping exists have no value.
  public DateTime? UploadedOn { get; set; }

  // Intrinsic image dimensions, when the file is an image. Known for free at upload time (the client
  // already decodes the image to downscale it) and used to reserve the correct box before the image
  // loads, so entries below it don't jump. Backfilling them later would mean downloading and
  // decoding every existing blob.
  public int? Width { get; set; }

  public int? Height { get; set; }
}
