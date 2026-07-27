using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Files;
using Engraved.Core.Domain.Files;

namespace Engraved.Core.Tests.Application.Queries.Files;

public class FakeFileStore : IFileStore
{
  public FileRef? LastReadUrlFile { get; private set; }

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
    return Task.CompletedTask;
  }
}
