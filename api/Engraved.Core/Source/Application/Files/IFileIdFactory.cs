namespace Engraved.Core.Application.Files;

// A file id is handed to the client at upload and comes back on an entry at save, so on its own it
// says nothing about who is entitled to attach it. Signing it with the id of the user who requested
// the upload makes that answerable without storing anything: the signature only verifies against the
// user it was minted for.
//
// This is what makes access revocable. Without it, anyone who has ever seen a file id - a user a
// journal was shared with and later unshared from, say - could keep reading the file forever by
// attaching the id to an entry of their own.
public interface IFileIdFactory
{
  string Create(string userId);

  bool BelongsToUser(string fileId, string userId);
}
