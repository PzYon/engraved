using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoRepository_GetAllJournals_Should
{
  private MongoRepository _repository = null!;
  private string _gaugeJournalId = null!;

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
    Assert.AreEqual(3, results.Length);
  }

  [Test]
  public async Task ReturnLimitedJournals()
  {
    IJournal[] results = await _repository.GetAllJournals(null, null, null, 1);
    Assert.AreEqual(1, results.Length);
  }

  [Test]
  public async Task Return_Matching_Name()
  {
    IJournal[] results = await _repository.GetAllJournals("gauge");
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual("Gauge", results[0].Name);
  }

  [Test]
  public async Task Return_Matching_Description()
  {
    IJournal[] results = await _repository.GetAllJournals("tim3r");
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual("Timer", results[0].Name);
  }

  [Test]
  public async Task Return_Matching_JournalTypes()
  {
    IJournal[] results = await _repository.GetAllJournals(null, new[] { JournalType.Timer, JournalType.Gauge });
    Assert.AreEqual(2, results.Length);
  }

  [Test]
  public async Task Return_Matching_JournalId()
  {
    IJournal[] results = await _repository.GetAllJournals(null, null, new[] { _gaugeJournalId }, 10);
    Assert.AreEqual(1, results.Length);
    Assert.AreEqual(results[0].Id, _gaugeJournalId);
  }
}
