using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Files;
using Engraved.Core.Domain.Files;

namespace Engraved.Core.Tests.Application.Queries.Files;

public class FakeFileStore : IFileStore
{
  // Stands in for what the store actually holds. A file id absent from here behaves like a blob that
  // was never uploaded.
  private readonly Dictionary<string, long> _contentLengthsById = new();

  public FileRef? LastReadUrlFile { get; private set; }

  public List<string> DeletedFileIds { get; } = [];

  public void SetContentLength(string fileId, long contentLength)
  {
    _contentLengthsById[fileId] = contentLength;
  }

  public Task<Uri> CreateUploadUrl(string fileId)
  {
    return Task.FromResult(new Uri($"https://files.example/{fileId}?upload"));
  }

  public Task<Uri> CreateReadUrl(FileRef file)
  {
    LastReadUrlFile = file;

    return Task.FromResult(new Uri($"https://files.example/{file.Id}?read"));
  }

  public Task Delete(string fileId)
  {
    DeletedFileIds.Add(fileId);

    return Task.CompletedTask;
  }

  public Task<long?> GetContentLength(string fileId)
  {
    return Task.FromResult(
      _contentLengthsById.TryGetValue(fileId, out var contentLength) ? contentLength : (long?) null
    );
  }
}
