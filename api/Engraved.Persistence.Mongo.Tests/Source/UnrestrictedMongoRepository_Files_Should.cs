using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Files;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UnrestrictedMongoRepository_Files_Should
{
  private const string FileId = "8a1d3f9c4b2e4a7f9c0d1e2f";

  private static readonly DateTime UploadedOn = new(2026, 7, 27, 14, 30, 0, DateTimeKind.Utc);

  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task RoundTrip_Files()
  {
    var entryId = await AddScrapWithFile();

    IEntry entry = (await _repo.GetEntry(entryId))!;

    entry.Files.Should().HaveCount(1);
    entry.Files[0].Id.Should().Be(FileId);
    entry.Files[0].FileName.Should().Be("holiday.png");
    entry.Files[0].ContentType.Should().Be("image/png");
    entry.Files[0].ContentLength.Should().Be(1234);
    entry.Files[0].UploadedOn.Should().BeCloseTo(UploadedOn, TimeSpan.FromMilliseconds(1));
    entry.Files[0].Width.Should().Be(800);
    entry.Files[0].Height.Should().Be(600);
  }

  // Every entry already in the database was written before this field existed and has no Files
  // element at all - deploying must not make them unreadable. Deliberately inserted as raw BSON:
  // going through UpsertEntry would write "Files: []" and quietly test nothing.
  [Test]
  public async Task Load_EntriesStoredWithoutTheFilesElement()
  {
    var entryId = ObjectId.GenerateNewId();

    await _repo.Entries.Database.GetCollection<BsonDocument>("entries")
      .InsertOneAsync(
        new BsonDocument
        {
          { "_id", entryId },
          { "_t", new BsonArray { "EntryDocument", "ScrapsEntryDocument" } },
          { "ParentId", "60703c3b0000000000000001" },
          { "Title", "written before files existed" }
        }
      );

    IEntry loaded = (await _repo.GetEntry(entryId.ToString()))!;

    loaded.Files.Should().BeEmpty();
  }

  [Test]
  public async Task Find_TheOwningEntry_By_FileId()
  {
    var entryId = await AddScrapWithFile();

    IEntry? entry = await _repo.GetEntryByFileId(FileId);

    entry.Should().NotBeNull();
    entry!.Id.Should().Be(entryId);
  }

  [Test]
  public async Task Return_Null_When_NoEntryHasTheFile()
  {
    await AddScrapWithFile();

    IEntry? entry = await _repo.GetEntryByFileId("8a1d3f9c4b2e4a7f9c0d1e2e");

    entry.Should().BeNull();
  }

  private async Task<string> AddScrapWithFile()
  {
    UpsertResult journal = await _repo.UpsertJournal(new ScrapsJournal());

    UpsertResult entry = await _repo.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = journal.EntityId,
        Title = "with file",
        Files =
        [
          new FileRef
          {
            Id = FileId,
            FileName = "holiday.png",
            ContentType = "image/png",
            ContentLength = 1234,
            UploadedOn = UploadedOn,
            Width = 800,
            Height = 600
          }
        ]
      }
    );

    return entry.EntityId;
  }
}
