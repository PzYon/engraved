﻿using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using FluentAssertions;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_SearchEntries_Should
{
  private string _journalId = null!;
  private MongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    var journal = new GaugeJournal { Name = "Test" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    _journalId = result.EntityId;

    await _repository.UpsertEntry(
      new GaugeEntry
      {
        ParentId = result.EntityId,
        Value = 1,
        Notes = "Lorem ipsum dolor", EditedOn = DateTime.Now.AddDays(-10)
      }
    );
    await _repository.UpsertEntry(
      new GaugeEntry
      {
        ParentId = result.EntityId,
        Value = 2,
        Notes = "Alpha Beta Gamma",
        EditedOn = DateTime.Now.AddDays(-20)
      }
    );
    await _repository.UpsertEntry(
      new GaugeEntry
      {
        ParentId = result.EntityId,
        Value = 3,
        Notes = "Heiri Herbert Hans",
        EditedOn = DateTime.Now.AddDays(-30)
      }
    );
  }

  [Test]
  public async Task FindEntries()
  {
    IEntry[] results = await _repository.SearchEntries("Beta", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_IgnoringCase()
  {
    IEntry[] results = await _repository.SearchEntries("beta", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_MultipleWords()
  {
    IEntry[] results = await _repository.SearchEntries("beta gam", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task FindEntries_NonConsecutiveWords()
  {
    IEntry[] results = await _repository.SearchEntries("alpha gam", null, null, [_journalId], 10);
    results.Length.Should().Be(1);
    results[0].GetValue().Should().Be(2);
  }

  [Test]
  public async Task Consider_ScrapsTitle()
  {
    var journal = new ScrapsJournal { Name = "My Scrap" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    await _repository.UpsertEntry(
      new ScrapsEntry { ParentId = result.EntityId, ScrapType = ScrapType.List, Title = "Heiri" }
    );
    await _repository.UpsertEntry(
      new ScrapsEntry { ParentId = result.EntityId, ScrapType = ScrapType.List, Title = "Franz" }
    );

    IEntry[] results = await _repository.SearchEntries("heiri", null, null, [result.EntityId], 10);

    results.Length.Should().Be(1);
    ((ScrapsEntry)results[0]).Title.Should().Be("Heiri");
  }

  [Test]
  public async Task Consider_JournalTypes_Negative()
  {
    IEntry[] results = await _repository.SearchEntries(
      null,
      null,
      [JournalType.Counter],
      null,
      10
    );

    results.Should().BeEmpty();
  }

  [Test]
  public async Task Consider_JournalTypes_Positive()
  {
    var journal = new ScrapsJournal { Name = "My Scrap" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    await _repository.UpsertEntry(
      new ScrapsEntry { ParentId = result.EntityId, ScrapType = ScrapType.List, Title = "Heiri" }
    );

    IEntry[] results = await _repository.SearchEntries(
      null,
      null,
      [JournalType.Scraps],
      null,
      10
    );

    results.Length.Should().Be(1);
    results[0].Should().BeOfType<ScrapsEntry>();
  }

  [Test]
  public async Task Sort_Scheduled_Before_EditedOn()
  {
    var currentUserId = ObjectId.GenerateNewId().ToString();

    UpsertResult result = await _repository.UpsertJournal(
      new ScrapsJournal
      {
        Name = "My Scrap",
        UserId = currentUserId
      }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = result.EntityId,
        ScrapType = ScrapType.List,
        Title = "WithSchedule",
        EditedOn = DateTime.Now.AddDays(-2),
        Schedules = { { currentUserId, new Schedule { NextOccurrence = DateTime.Now.AddDays(-222) } } }
      }
    );

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = result.EntityId,
        ScrapType = ScrapType.List,
        Title = "WithOtherUserSchedule",
        EditedOn = DateTime.Now.AddDays(-2),
        Schedules =
        {
          { ObjectId.GenerateNewId().ToString(), new Schedule { NextOccurrence = DateTime.Now.AddDays(-222) } }
        }
      }
    );

    // edited on "now" is newer than "now-2days", but due to
    // schedule, "now-2days" should be sorted first.

    await _repository.UpsertEntry(
      new ScrapsEntry
      {
        ParentId = result.EntityId,
        ScrapType = ScrapType.List,
        Title = "WithoutSchedule",
        UserId = currentUserId,
        EditedOn = DateTime.Now.AddDays(-1000),
      }
    );

    IEntry[] results = await _repository.SearchEntries(
      null,
      ScheduleMode.CurrentUserFirst,
      null,
      null,
      20,
      currentUserId
    );

    results.Length.Should().Be(6);
    ((ScrapsEntry)results[0]).Title.Should().Be("WithSchedule");
    ((ScrapsEntry)results[1]).Title.Should().Be("WithOtherUserSchedule");
    ((ScrapsEntry)results[5]).Title.Should().Be("WithoutSchedule");
  }
}
