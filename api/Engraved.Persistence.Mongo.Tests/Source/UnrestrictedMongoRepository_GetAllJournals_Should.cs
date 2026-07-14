using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using Engraved.Persistence.Mongo.Repositories;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UnrestrictedMongoRepository_GetAllJournals_Should
{
  private string _gaugeJournalId = null!;
  private UnrestrictedMongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();

    var gauge = new GaugeJournal { Name = "Gauge", Description = "G@ug3 Description" };
    UpsertResult upsertGaugeJournal = await _repository.UpsertJournal(gauge);
    _gaugeJournalId = upsertGaugeJournal.EntityId;

    var counter = new CounterJournal { Name = "Counter", Description = "Count3r Description" };
    await _repository.UpsertJournal(counter);

    var timer = new TimerJournal { Name = "Timer", Description = "Tim3r Description" };
    await _repository.UpsertJournal(timer);
  }

  [Test]
  public async Task ReturnAllJournals_WithEmptyQuery()
  {
    var results = await _repository.GetAllJournals();
    results.Length.Should().Be(3);
  }

  [Test]
  public async Task ReturnLimitedJournals()
  {
    var results = await _repository.GetAllJournals(null, null, null, null, 1);
    results.Length.Should().Be(1);
  }

  [Test]
  public async Task Return_Matching_Name()
  {
    var results = await _repository.GetAllJournals("gauge");
    results.Length.Should().Be(1);
    results[0].Name.Should().Be("Gauge");
  }

  [Test]
  public async Task Return_Matching_Description()
  {
    var results = await _repository.GetAllJournals("tim3r");
    results.Length.Should().Be(1);
    results[0].Name.Should().Be("Timer");
  }

  [Test]
  public async Task Return_Matching_JournalTypes()
  {
    var results = await _repository.GetAllJournals(null, null, [JournalType.Timer, JournalType.Gauge]);
    results.Length.Should().Be(2);
  }

  [Test]
  public async Task Return_Matching_JournalTypes_LogBook()
  {
    await _repository.UpsertJournal(new LogBookJournal { Name = "LogBook" });

    var results = await _repository.GetAllJournals(null, null, [JournalType.LogBook]);

    results.Length.Should().Be(1);
    results[0].Should().BeOfType<LogBookJournal>();
  }

  [Test]
  public async Task Return_Matching_JournalId()
  {
    var results = await _repository.GetAllJournals(null, null, null, [_gaugeJournalId], 10);
    results.Length.Should().Be(1);
    results[0].Id.Should().Be(_gaugeJournalId);
  }

  [Test]
  public async Task ReturnAllJournals_SchedulesOnly()
  {
    await _repository.UpsertJournal(
      new GaugeJournal
      {
        Schedules = new Dictionary<string, Schedule>
        {
          { "max", new Schedule { NextOccurrence = DateTime.Now.AddDays(3) } }
        }
      }
    );

    await _repository.UpsertJournal(
      new GaugeJournal
      {
        Schedules = new Dictionary<string, Schedule>
        {
          { "franz", new Schedule { NextOccurrence = DateTime.Now.AddDays(3) } }
        }
      }
    );

    var results = await _repository.GetAllJournals(
      null,
      ScheduleMode.CurrentUserOnly,
      null,
      null,
      null,
      "max"
    );
    results.Length.Should().Be(1);
  }

  [Test]
  public async Task ReturnAllJournals_SchedulesOnly_ExcludesFiredSchedules()
  {
    // pending schedule for "max"
    await _repository.UpsertJournal(
      new GaugeJournal
      {
        Schedules = new Dictionary<string, Schedule>
        {
          { "max", new Schedule { NextOccurrence = DateTime.Now.AddDays(3) } }
        }
      }
    );

    // schedule for "max" that has already fired (sub-document kept, but no pending occurrence)
    await _repository.UpsertJournal(
      new GaugeJournal
      {
        Schedules = new Dictionary<string, Schedule>
        {
          { "max", new Schedule { NextOccurrence = null } }
        }
      }
    );

    var results = await _repository.GetAllJournals(
      null,
      ScheduleMode.CurrentUserOnly,
      null,
      null,
      null,
      "max"
    );

    // only the journal with a pending occurrence counts as "scheduled"
    results.Length.Should().Be(1);
  }
}
