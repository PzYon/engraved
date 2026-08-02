namespace Engraved.Core.Application.Files;

// Bytes are uploaded before the entry that will own them is saved, so between those two moments a
// blob exists that nothing references - and if the edit is then cancelled, nothing ever will. The
// store cannot tell that blob apart from an attached one by age alone, so the upload states it:
// every upload is tagged pending, and accepting it onto an entry flips it to committed. A lifecycle
// rule on the store then deletes what is still pending after a day.
//
// The name and values are part of the contract with the storage account's lifecycle rule and with
// the client that sets the tag at upload (see fileStorageApi.ts), so they are fixed here rather than
// configured.
public static class FileTags
{
  public const string StateName = "state";

  public const string Pending = "pending";

  public const string Committed = "committed";
}
