using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_GetAllJournals_Should
{
  private string _gaugeJournalId = null!;
  private MongoRepository _repository = null!;

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
    IJournal[] results = await _repository.GetAllJournals();
    results.Length.Should().Be(3);
  }

  [Test]
  public async Task ReturnLimitedJournals()
  {
    IJournal[] results = await _repository.GetAllJournals(null, false, null, null, 1);
    results.Length.Should().Be(1);
  }

  [Test]
  public async Task Return_Matching_Name()
  {
    IJournal[] results = await _repository.GetAllJournals("gauge");
    results.Length.Should().Be(1);
    results[0].Name.Should().Be("Gauge");
  }

  [Test]
  public async Task Return_Matching_Description()
  {
    IJournal[] results = await _repository.GetAllJournals("tim3r");
    results.Length.Should().Be(1);
    results[0].Name.Should().Be("Timer");
  }

  [Test]
  public async Task Return_Matching_JournalTypes()
  {
    IJournal[] results = await _repository.GetAllJournals(null, false, [JournalType.Timer, JournalType.Gauge]);
    results.Length.Should().Be(2);
  }

  [Test]
  public async Task Return_Matching_JournalId()
  {
    IJournal[] results = await _repository.GetAllJournals(null, false, null, [_gaugeJournalId], 10);
    results.Length.Should().Be(1);
    results[0].Id.Should().Be(_gaugeJournalId);
  }

  [Test]
  public async Task ReturnAllJournals_SchedulesOnly()
  {
    var gaugeJournal = new GaugeJournal
    {
      Schedule = new Schedule
      {
        NextOccurrence = DateTime.Now.AddDays(3)
      },
      Name = "My Name"
    };

    gaugeJournal.Schedules["max"] = new Schedule
    {
      NextOccurrence = DateTime.Now.AddDays(3)
    };

    await _repository.UpsertJournal(gaugeJournal);

    IJournal[] results = await _repository.GetAllJournals(null, true);
    results.Length.Should().Be(1);
  }
}
