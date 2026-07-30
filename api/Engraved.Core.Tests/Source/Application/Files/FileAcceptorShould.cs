using System;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Files;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Users;
using Engraved.Core.Tests.Application.Queries.Files;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Files;

public class FileAcceptorShould
{
  private const string UserId = TestIds.UserId;
  private const string OtherUserId = TestIds.OtherUserId;

  private static readonly DateTime Now = new(2026, 7, 30, 9, 0, 0, DateTimeKind.Utc);

  private FileAcceptor _acceptor = null!;
  private FileIdFactory _fileIdFactory = null!;
  private FakeFileStore _fileStore = null!;

  [SetUp]
  public void SetUp()
  {
    _fileStore = new FakeFileStore();
    _fileIdFactory = new FileIdFactory("test-signing-key");

    _acceptor = new FileAcceptor(
      _fileStore,
      _fileIdFactory,
      new FakeDateService(Now),
      new Lazy<IUser>(() => new User { Id = UserId, Name = UserId })
    );
  }

  [Test]
  public async Task Accept_A_FileTheCurrentUserUploaded()
  {
    FileRef file = CreateUploadedFile(UserId, 1234);

    FileRef[] result = await _acceptor.Accept([file], []);

    result.Should().HaveCount(1);
    result[0].Id.Should().Be(file.Id);
  }

  // Without this, anyone who has ever seen a file id could read the file forever by putting it on an
  // entry of their own - which is what makes unsharing a journal meaningless.
  [Test]
  public async Task Reject_A_FileUploadedBySomeoneElse()
  {
    FileRef file = CreateUploadedFile(OtherUserId, 1234);

    Func<Task> act = async () => await _acceptor.Accept([file], []);

    await act.Should().ThrowAsync<NotAllowedOperationException>();
  }

  [Test]
  public async Task Reject_A_FileThatWasNeverUploaded()
  {
    var file = new FileRef
    {
      Id = _fileIdFactory.Create(UserId),
      FileName = "ghost.png",
      ContentType = "image/png"
    };

    Func<Task> act = async () => await _acceptor.Accept([file], []);

    await act.Should().ThrowAsync<NotAllowedOperationException>();
  }

  // A collaborator editing a scrap in a shared journal must not have someone else's files stripped
  // out from under them, so what is already on the entry is never re-checked.
  [Test]
  public async Task Keep_A_FileAlreadyOnTheEntry_EvenWhenUploadedBySomeoneElse()
  {
    FileRef stored = CreateUploadedFile(OtherUserId, 1234);
    stored.UploadedOn = Now.AddDays(-3);

    FileRef[] result = await _acceptor.Accept([stored], [stored]);

    result.Should().HaveCount(1);
    result[0].UploadedOn.Should().Be(Now.AddDays(-3));
  }

  // The stored version wins for files already on the entry, so a client cannot rewrite the size or
  // the upload date of something it merely re-sent.
  [Test]
  public async Task Ignore_ClientChanges_To_A_FileAlreadyOnTheEntry()
  {
    FileRef stored = CreateUploadedFile(UserId, 1234);
    stored.UploadedOn = Now.AddDays(-3);

    var tampered = new FileRef
    {
      Id = stored.Id,
      FileName = "renamed.png",
      ContentType = "image/png",
      ContentLength = 99,
      UploadedOn = Now
    };

    FileRef[] result = await _acceptor.Accept([tampered], [stored]);

    result[0].FileName.Should().Be("holiday.png");
    result[0].ContentLength.Should().Be(1234);
    result[0].UploadedOn.Should().Be(Now.AddDays(-3));
  }

  [Test]
  public async Task Take_ContentLength_FromTheStore_NotTheClient()
  {
    FileRef file = CreateUploadedFile(UserId, 4096);
    file.ContentLength = 1;

    FileRef[] result = await _acceptor.Accept([file], []);

    result[0].ContentLength.Should().Be(4096);
  }

  [Test]
  public async Task Stamp_UploadedOn_Itself()
  {
    FileRef file = CreateUploadedFile(UserId, 1234);
    file.UploadedOn = new DateTime(1999, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    FileRef[] result = await _acceptor.Accept([file], []);

    result[0].UploadedOn.Should().Be(Now);
  }

  // The claimed size is only a courtesy check at upload; a SAS cannot cap what is actually put, so
  // this is where the limit becomes real.
  [Test]
  public async Task Reject_A_FileThatIsBiggerThanTheLimit()
  {
    FileRef file = CreateUploadedFile(UserId, FileSizeLimits.MaxFileSizeBytes + 1);

    Func<Task> act = async () => await _acceptor.Accept([file], []);

    await act.Should().ThrowAsync<InvalidOperationException>();
  }

  [Test]
  public async Task Sanitize_TheFileName()
  {
    FileRef file = CreateUploadedFile(UserId, 1234);
    file.FileName = "brea\r\nking.png";

    FileRef[] result = await _acceptor.Accept([file], []);

    result[0].FileName.Should().Be("breaking.png");
  }

  // Leaving a file out is how it is removed. The blob is deliberately left behind: the delete and the
  // entry write cannot be atomic, so deleting first would lose a file whenever the write then fails.
  [Test]
  public async Task Drop_FilesTheClientLeftOut_WithoutDeletingTheBlob()
  {
    FileRef stored = CreateUploadedFile(UserId, 1234);

    FileRef[] result = await _acceptor.Accept([], [stored]);

    result.Should().BeEmpty();
    _fileStore.DeletedFileIds.Should().BeEmpty();
  }

  private FileRef CreateUploadedFile(string uploaderId, long contentLength)
  {
    var fileId = _fileIdFactory.Create(uploaderId);

    _fileStore.SetContentLength(fileId, contentLength);

    return new FileRef
    {
      Id = fileId,
      FileName = "holiday.png",
      ContentType = "image/png",
      ContentLength = contentLength
    };
  }
}
