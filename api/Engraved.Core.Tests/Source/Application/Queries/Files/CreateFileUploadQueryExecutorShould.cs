using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Queries.Files.CreateUpload;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Queries.Files;

public class CreateFileUploadQueryExecutorShould
{
  private const string UserName = "current@user.com";
  private const string OtherUserName = "other@user.com";

  private FakeFileStore _fileStore = null!;
  private string _otherUserId = null!;
  private TestUserRestrictedMongoRepository _repo = null!;
  private TestMongoRepository _seedRepo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _seedRepo = await Util.CreateMongoRepository();

    var userId = (await _seedRepo.UpsertUser(new User { Name = UserName })).EntityId;
    _otherUserId = (await _seedRepo.UpsertUser(new User { Name = OtherUserName })).EntityId;

    _repo = await Util.CreateUserRestrictedMongoRepository(UserName, userId, true);
    _fileStore = new FakeFileStore();
  }

  [Test]
  public async Task Return_UploadAndReadUrl_For_OwnJournal()
  {
    var journalId = await AddJournal(_repo.CurrentUser.Value.Id!);

    CreateFileUploadResult result = await Execute(journalId);

    result.File.Id.Should().NotBeNullOrEmpty();
    result.File.FileName.Should().Be("holiday.png");
    result.File.ContentType.Should().Be("image/png");
    result.File.ContentLength.Should().Be(1234);
    result.UploadUrl.Should().Contain(result.File.Id);
    result.ReadUrl.Should().Contain(result.File.Id);
  }

  // UploadedOn is stamped when the file is accepted onto an entry, not here. A FileRef minted at
  // upload travels out to the client and comes back at save, so a timestamp set now would be
  // client-supplied by the time it is stored - which would make it worth less than no timestamp.
  [Test]
  public async Task Not_Stamp_UploadedOn()
  {
    var journalId = await AddJournal(_repo.CurrentUser.Value.Id!);

    CreateFileUploadResult result = await Execute(journalId);

    result.File.UploadedOn.Should().BeNull();
  }

  [Test]
  public async Task Return_A_NewFileId_On_EveryCall()
  {
    var journalId = await AddJournal(_repo.CurrentUser.Value.Id!);

    CreateFileUploadResult first = await Execute(journalId);
    CreateFileUploadResult second = await Execute(journalId);

    second.File.Id.Should().NotBe(first.File.Id);
  }

  [Test]
  public async Task Return_UploadUrl_When_JournalIsSharedForWriting()
  {
    var journalId = await AddJournal(
      _otherUserId,
      new PermissionDefinition { Kind = PermissionKind.Write }
    );

    CreateFileUploadResult result = await Execute(journalId);

    result.UploadUrl.Should().NotBeNullOrEmpty();
  }

  // Read access on the journal is not enough: uploading is a write, even though nothing is written
  // to the database yet.
  [Test]
  public async Task Throw_When_JournalIsOnlyReadable()
  {
    var journalId = await AddJournal(
      _otherUserId,
      new PermissionDefinition { Kind = PermissionKind.Read }
    );

    Func<Task> act = async () => await Execute(journalId);

    await act.Should().ThrowAsync<NotAllowedOperationException>();
  }

  [Test]
  public async Task Throw_When_JournalIsNotSharedAtAll()
  {
    var journalId = await AddJournal(_otherUserId);

    Func<Task> act = async () => await Execute(journalId);

    await act.Should().ThrowAsync<NotAllowedOperationException>();
  }

  [Test]
  public async Task Throw_When_JournalDoesNotExist()
  {
    Func<Task> act = async () => await Execute("60703c3b0000000000000099");

    await act.Should().ThrowAsync<NotAllowedOperationException>();
  }

  [Test]
  public async Task Throw_When_FileIsTooLarge()
  {
    var journalId = await AddJournal(_repo.CurrentUser.Value.Id!);

    Func<Task> act = async () => await Execute(journalId, 50 * 1024 * 1024);

    await act.Should().ThrowAsync<InvalidQueryException>();
  }

  [Test]
  public async Task Sanitize_FileNamesThatCouldInjectHeaders()
  {
    var journalId = await AddJournal(_repo.CurrentUser.Value.Id!);

    CreateFileUploadResult result = await Execute(journalId, fileName: "eo\"l\r\ninjected: yes.png");

    result.File.FileName.Should().Be("eolinjected: yes.png");
  }

  private async Task<string> AddJournal(string ownerId, PermissionDefinition? permissionForCurrentUser = null)
  {
    var permissions = new UserPermissions();

    if (permissionForCurrentUser != null)
    {
      permissions.Add(_repo.CurrentUser.Value.Id!, permissionForCurrentUser);
    }

    UpsertResult journal = await _seedRepo.UpsertJournal(
      new ScrapsJournal
      {
        UserId = ownerId,
        Permissions = permissions
      }
    );

    return journal.EntityId;
  }

  private async Task<CreateFileUploadResult> Execute(
    string journalId,
    long length = 1234,
    string fileName = "holiday.png"
  )
  {
    return await new CreateFileUploadQueryExecutor(_repo, _fileStore, _repo.CurrentUser).Execute(
      new CreateFileUploadQuery
      {
        JournalId = journalId,
        FileName = fileName,
        ContentType = "image/png",
        ContentLength = length
      }
    );
  }
}
