using System;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Files;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Users;

namespace Engraved.TestUtils;

/// <summary>
///   Every entry-upsert executor takes a <see cref="FileAcceptor" />, including in the many tests that
///   have nothing to do with files. Accepting an empty list never reaches the store, the id factory or
///   the current user, so those tests can use this and stay about what they are testing.
/// </summary>
public static class TestFileAcceptor
{
  public static FileAcceptor Create(string userId = TestIds.UserId)
  {
    return new FileAcceptor(
      new UnreachableFileStore(),
      new FileIdFactory("test-signing-key"),
      new FakeDateService(),
      new Lazy<IUser>(() => new User { Id = userId, Name = userId })
    );
  }

  // Throws rather than returning something benign: a test that does reach the store should say so by
  // passing a real fake, not silently get a null back from here.
  private class UnreachableFileStore : IFileStore
  {
    public Task<Uri> CreateUploadUrl(string fileId)
    {
      throw new InvalidOperationException(Message);
    }

    public Task<Uri> CreateReadUrl(FileRef file)
    {
      throw new InvalidOperationException(Message);
    }

    public Task Delete(string fileId)
    {
      throw new InvalidOperationException(Message);
    }

    public Task<long?> GetContentLength(string fileId)
    {
      throw new InvalidOperationException(Message);
    }

    private const string Message =
      "This test reached the file store through TestFileAcceptor - pass a real fake store instead.";
  }
}
