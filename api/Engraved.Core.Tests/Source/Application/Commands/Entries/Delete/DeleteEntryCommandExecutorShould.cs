using System;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Delete;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Tests.Application.Queries.Files;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Entries.Delete;

public class DeleteEntryCommandExecutorShould
{
  private FakeDateService _dateService = null!;
  private FakeFileStore _fileStore = null!;
  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
    _fileStore = new FakeFileStore();
    _dateService = new FakeDateService(DateTime.UtcNow.AddDays(-10));
  }

  [Test]
  public async Task DeleteEntry_And_BumpJournalEditedOn()
  {
    const string journalId = "60703c3b0000000000000001";
    const string otherUserId = "60703c3b0000000000000002";
    const string entryId = "60703c3b0000000000000003";

    // given
    await _repo.UpsertJournal(
      new CounterJournal
      {
        Id = journalId,
        Permissions = new UserPermissions { { otherUserId, new PermissionDefinition { Kind = PermissionKind.Read } } }
      }
    );
    await _repo.UpsertEntry(
      new CounterEntry
      {
        Id = entryId,
        ParentId = journalId,
        DateTime = _dateService.UtcNow
      }
    );

    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _repo, _fileStore, _dateService).Execute(
      new DeleteEntryCommand { Id = entryId }
    );

    // then
    (await _repo.GetEntry(entryId)).Should().BeNull();

    IJournal journal = (await _repo.GetJournal(journalId))!;
    journal.EditedOn.Should().BeCloseTo(_dateService.UtcNow, TimeSpan.FromMilliseconds(100));

    result.EntityId.Should().Be(entryId);
    result.AffectedUserIds.Should().Contain(otherUserId);
  }

  // Nothing will ever reference these blobs again, so deleting the entry has to take them with it or
  // they are stored - and paid for - forever.
  [Test]
  public async Task DeleteTheEntrysFiles()
  {
    const string journalId = "60703c3b0000000000000011";
    const string entryId = "60703c3b0000000000000013";

    await _repo.UpsertJournal(new ScrapsJournal { Id = journalId });
    await _repo.UpsertEntry(
      new ScrapsEntry
      {
        Id = entryId,
        ParentId = journalId,
        Title = "with files",
        Files =
        [
          new FileRef { Id = "file-one", FileName = "a.png", ContentType = "image/png" },
          new FileRef { Id = "file-two", FileName = "b.pdf", ContentType = "application/pdf" }
        ]
      }
    );

    await new DeleteEntryCommandExecutor(_repo, _repo, _fileStore, _dateService).Execute(
      new DeleteEntryCommand { Id = entryId }
    );

    _fileStore.DeletedFileIds.Should().BeEquivalentTo("file-one", "file-two");
  }

  [Test]
  public async Task ReturnEmptyResult_When_EntryDoesNotExist()
  {
    const string missingEntryId = "60703c3b0000000000000004";

    // when
    CommandResult result = await new DeleteEntryCommandExecutor(_repo, _repo, _fileStore, _dateService).Execute(
      new DeleteEntryCommand { Id = missingEntryId }
    );

    // then
    result.EntityId.Should().BeNull();
    result.AffectedUserIds.Should().BeEmpty();
  }
}
