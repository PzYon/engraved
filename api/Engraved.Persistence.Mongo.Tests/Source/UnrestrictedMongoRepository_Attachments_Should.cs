using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UnrestrictedMongoRepository_Attachments_Should
{
  private const string FileId = "8a1d3f9c4b2e4a7f9c0d1e2f";

  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task RoundTrip_Attachments()
  {
    var entryId = await AddScrapWithAttachment();

    IEntry entry = (await _repo.GetEntry(entryId))!;

    entry.Attachments.Should().HaveCount(1);
    entry.Attachments[0].Id.Should().Be(FileId);
    entry.Attachments[0].FileName.Should().Be("holiday.png");
    entry.Attachments[0].ContentType.Should().Be("image/png");
    entry.Attachments[0].Length.Should().Be(1234);
    entry.Attachments[0].Width.Should().Be(800);
    entry.Attachments[0].Height.Should().Be(600);
  }

  // Entries written before attachments existed have no such field at all, and must keep loading.
  [Test]
  public async Task Return_EmptyAttachments_For_EntriesWithoutAny()
  {
    UpsertResult journal = await _repo.UpsertJournal(new ScrapsJournal());
    UpsertResult entry = await _repo.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = journal.EntityId,
        Title = "no files here"
      }
    );

    IEntry loaded = (await _repo.GetEntry(entry.EntityId))!;

    loaded.Attachments.Should().BeEmpty();
  }

  [Test]
  public async Task Find_TheOwningEntry_By_AttachmentId()
  {
    var entryId = await AddScrapWithAttachment();

    IEntry? entry = await _repo.GetEntryByAttachmentId(FileId);

    entry.Should().NotBeNull();
    entry!.Id.Should().Be(entryId);
  }

  [Test]
  public async Task Return_Null_When_NoEntryHasTheAttachment()
  {
    await AddScrapWithAttachment();

    IEntry? entry = await _repo.GetEntryByAttachmentId("8a1d3f9c4b2e4a7f9c0d1e2e");

    entry.Should().BeNull();
  }

  private async Task<string> AddScrapWithAttachment()
  {
    UpsertResult journal = await _repo.UpsertJournal(new ScrapsJournal());

    UpsertResult entry = await _repo.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = journal.EntityId,
        Title = "with attachment",
        Attachments =
        [
          new FileRef
          {
            Id = FileId,
            FileName = "holiday.png",
            ContentType = "image/png",
            Length = 1234,
            Width = 800,
            Height = 600
          }
        ]
      }
    );

    return entry.EntityId;
  }
}
