using System.Net;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Engraved.Core.Application.Files;
using Engraved.Core.Domain.Files;

namespace Engraved.Storage.Azure;

// Blob names are the bare file id and nothing else: blob storage has no rename (what looks like a
// move is copy-then-delete, per blob, non-atomic), so anything that can change - which entry, which
// journal - would turn an ordinary edit into a data migration. Those relationships live in the
// database.
//
// Times come from the wall clock rather than IDateService: SAS lifetimes are validated by the
// storage service against real time, so a shifted clock would only produce URLs Azure rejects. The
// part worth testing is the expiry rounding, which lives in SasExpiry as a pure function.
public class AzureBlobFileStore(
  BlobContainerClient containerClient,
  UserDelegationKeyProvider? userDelegationKeyProvider
) : IFileStore
{
  public async Task<Uri> CreateUploadUrl(string fileId)
  {
    return await CreateSasUri(
      fileId,
      BlobSasPermissions.Create | BlobSasPermissions.Write,
      DateTimeOffset.UtcNow.Add(SasExpiry.UploadValidity),
      _ => { }
    );
  }

  public async Task<Uri> CreateReadUrl(FileRef file)
  {
    FileDisposition disposition = FileContentPolicy.GetDisposition(file.ContentType);
    var fileName = FileContentPolicy.SanitizeFileName(file.FileName);

    return await CreateSasUri(
      file.Id,
      BlobSasPermissions.Read,
      SasExpiry.GetReadExpiry(DateTimeOffset.UtcNow),
      builder =>
      {
        // Pinned onto the response by us rather than taken from whatever the client uploaded. This
        // is what makes the disposition decision stick: an SVG downloads instead of rendering as a
        // live document, no matter which headers were sent when it was put.
        builder.ContentType = file.ContentType;
        builder.ContentDisposition = disposition == FileDisposition.Inline
          ? $"inline; filename=\"{fileName}\""
          : $"attachment; filename=\"{fileName}\"";

        // A file id always refers to the same bytes, so the response can be cached indefinitely. The
        // URL changes when the signature window rolls over, which simply makes the next request a
        // miss - it never serves stale content.
        builder.CacheControl = "private, max-age=31536000, immutable";
      }
    );
  }

  public async Task Delete(string fileId)
  {
    await containerClient.GetBlobClient(fileId).DeleteIfExistsAsync();
  }

  public async Task<long?> GetContentLength(string fileId)
  {
    try
    {
      Response<BlobProperties> properties = await containerClient.GetBlobClient(fileId).GetPropertiesAsync();

      return properties.Value.ContentLength;
    }
    catch (RequestFailedException e) when (e.Status == (int) HttpStatusCode.NotFound)
    {
      return null;
    }
  }

  private async Task<Uri> CreateSasUri(
    string fileId,
    BlobSasPermissions permissions,
    DateTimeOffset expiresOn,
    Action<BlobSasBuilder> configure
  )
  {
    BlobClient blobClient = containerClient.GetBlobClient(fileId);

    var builder = new BlobSasBuilder
    {
      BlobContainerName = containerClient.Name,
      BlobName = fileId,
      Resource = "b",

      // Deliberately no StartsOn: it would have to sit slightly in the past to tolerate clock skew,
      // which would put a per-request timestamp into the URL and defeat the stable-URL caching that
      // SasExpiry.GetReadExpiry exists for.
      ExpiresOn = expiresOn
    };

    builder.SetPermissions(permissions);

    configure(builder);

    // Signing with the account key is only possible when the client was built from a connection
    // string carrying one, which is the local Azurite setup. In Azure the credential is a managed
    // identity with no key to sign with, so a user delegation key is used instead.
    if (userDelegationKeyProvider == null)
    {
      return blobClient.GenerateSasUri(builder);
    }

    UserDelegationKey key = await userDelegationKeyProvider.Get();

    var query = builder.ToSasQueryParameters(key, containerClient.AccountName).ToString();

    return new UriBuilder(blobClient.Uri) { Query = query }.Uri;
  }
}
