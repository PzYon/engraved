using System;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Files;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.Core.Tests.Application.Queries.Files;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Entries.Upsert;

// Removing a file from an entry is the one orphan the storage lifecycle rule can never catch: the
// blob is committed, so it looks exactly like a file that is still in use. Only the save that
// dropped it knows, which is why this lives on the upsert path.
public class UpsertEntryFileCleanupShould
{
  private const string JournalId = "60703c3b0000000000000021";
  private const string EntryId = "60703c3b0000000000000023";

  private FakeDateService _dateService = null!;
  private FileAcceptor _fileAcceptor = null!;
  private FileIdFactory _fileIdFactory = null!;
  private FakeFileStore _fileStore = null!;
  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
    _fileStore = new FakeFileStore();
    _fileIdFactory = new FileIdFactory("test-signing-key");
    _dateService = new FakeDateService(DateTime.UtcNow);

    _fileAcceptor = new FileAcceptor(
      _fileStore,
      _fileIdFactory,
      _dateService,
      new Lazy<IUser>(() => new User { Id = TestIds.UserId, Name = TestIds.UserId })
    );

    await _repo.UpsertJournal(new ScrapsJournal { Id = JournalId });
  }

  [Test]
  public async Task Delete_TheBlob_Of_A_FileRemovedFromTheEntry()
  {
    FileRef file = await GivenAnEntryWithAFile();

    await Save(files: []);

    _fileStore.DeletedFileIds.Should().BeEquivalentTo(file.Id);

    ScrapsEntry? entry = (ScrapsEntry?) await _repo.GetEntry(EntryId);
    entry!.Files.Should().BeEmpty();
  }

  [Test]
  public async Task Keep_TheBlob_Of_A_FileThatIsStillOnTheEntry()
  {
    FileRef file = await GivenAnEntryWithAFile();

    await Save([file]);

    _fileStore.DeletedFileIds.Should().BeEmpty();
  }

  // Adding a file must not disturb the one already there, which is the case that would break if the
  // removal were computed from the incoming list rather than from what was stored.
  [Test]
  public async Task Keep_TheExistingBlob_When_A_FileIsAdded()
  {
    FileRef existing = await GivenAnEntryWithAFile();
    FileRef added = CreateUploadedFile();

    await Save([existing, added]);

    _fileStore.DeletedFileIds.Should().BeEmpty();
    _fileStore.CommittedFileIds.Should().BeEquivalentTo(added.Id);
  }

  private async Task<FileRef> GivenAnEntryWithAFile()
  {
    FileRef file = CreateUploadedFile();

    await _repo.UpsertEntry(
      new ScrapsEntry
      {
        Id = EntryId,
        ParentId = JournalId,
        Title = "with a file",
        Files = [file]
      }
    );

    return file;
  }

  private FileRef CreateUploadedFile()
  {
    var fileId = _fileIdFactory.Create(TestIds.UserId);

    _fileStore.SetContentLength(fileId, 1234);

    return new FileRef
    {
      Id = fileId,
      FileName = "holiday.png",
      ContentType = "image/png",
      ContentLength = 1234
    };
  }

  private async Task Save(FileRef[] files)
  {
    await new UpsertScrapsEntryCommandExecutor(_repo, _repo, _dateService, _fileAcceptor).Execute(
      new UpsertScrapsEntryCommand
      {
        Id = EntryId,
        JournalId = JournalId,
        Title = "with a file",
        Files = files
      }
    );
  }
}
