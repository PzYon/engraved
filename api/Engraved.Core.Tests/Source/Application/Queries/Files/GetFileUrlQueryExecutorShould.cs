using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries.Files.GetUrl;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Queries.Files;

public class GetFileUrlQueryExecutorShould
{
  private const string UserName = "current@user.com";
  private const string OwnerUserName = "owner@user.com";
  private const string FileId = "8a1d3f9c4b2e4a7f9c0d1e2f";

  private FakeFileStore _fileStore = null!;
  private string _ownerUserId = null!;
  private TestUserRestrictedMongoRepository _repo = null!;
  private TestMongoRepository _seedRepo = null!;
  private string _userId = null!;

  [SetUp]
  public async Task SetUp()
  {
    _seedRepo = await Util.CreateMongoRepository();

    _userId = (await _seedRepo.UpsertUser(new User { Name = UserName })).EntityId;
    _ownerUserId = (await _seedRepo.UpsertUser(new User { Name = OwnerUserName })).EntityId;

    _repo = await Util.CreateUserRestrictedMongoRepository(UserName, _userId, true);
    _fileStore = new FakeFileStore();
  }

  [Test]
  public async Task Return_Url_For_FileOnOwnEntry()
  {
    await AddScrapWithAttachment(_userId);

    GetFileUrlResult? result = await Execute();

    result.Should().NotBeNull();
    result!.Url.Should().Contain(FileId);
  }

  // The read URL is built from what we stored, not from whatever the client uploaded - that is what
  // makes the content type (and with it the download-vs-render decision) ours to enforce.
  [Test]
  public async Task Pass_TheStoredFile_To_TheStore()
  {
    await AddScrapWithAttachment(_userId);

    await Execute();

    _fileStore.LastReadUrlFile.Should().NotBeNull();
    _fileStore.LastReadUrlFile!.FileName.Should().Be("diagram.svg");
    _fileStore.LastReadUrlFile.ContentType.Should().Be("image/svg+xml");
  }

  // No entry references the file, so nobody can read it. This is why the upload response hands out a
  // read URL directly: between uploading and saving the entry, there is nothing to resolve against.
  [Test]
  public async Task Return_Null_When_FileIsNotAttachedToAnyEntry()
  {
    GetFileUrlResult? result = await Execute();

    result.Should().BeNull();
  }

  [Test]
  public async Task Return_Null_When_UserMayNotReadTheJournal()
  {
    await AddScrapWithAttachment(_ownerUserId);

    GetFileUrlResult? result = await Execute();

    result.Should().BeNull();
  }

  [Test]
  public async Task Return_Url_When_JournalIsSharedReadOnly()
  {
    await AddScrapWithAttachment(
      _ownerUserId,
      new PermissionDefinition { Kind = PermissionKind.Read }
    );

    GetFileUrlResult? result = await Execute();

    result.Should().NotBeNull();
  }

  private async Task<GetFileUrlResult?> Execute()
  {
    return await new GetFileUrlQueryExecutor(_repo, _repo, _fileStore).Execute(
      new GetFileUrlQuery { FileId = FileId }
    );
  }

  private async Task AddScrapWithAttachment(string ownerId, PermissionDefinition? permissionForCurrentUser = null)
  {
    var permissions = new UserPermissions();

    if (permissionForCurrentUser != null)
    {
      permissions.Add(_userId, permissionForCurrentUser);
    }

    UpsertResult journal = await _seedRepo.UpsertJournal(
      new ScrapsJournal
      {
        UserId = ownerId,
        Permissions = permissions
      }
    );

    await _seedRepo.UpsertEntry(
      new ScrapsEntry
      {
        UserId = ownerId,
        ParentId = journal.EntityId,
        Title = "with attachment",
        Attachments =
        [
          new FileRef
          {
            Id = FileId,
            FileName = "diagram.svg",
            ContentType = "image/svg+xml",
            Length = 42
          }
        ]
      }
    );
  }
}
