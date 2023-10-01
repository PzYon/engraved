using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Activities.Get;

public class GetActivitiesQueryExecutorShould
{
  private InMemoryRepository _repo = null!;
  private FakeDateService _dateService = null!;

  [SetUp]
  public void SetUp()
  {
    _repo = new InMemoryRepository();
    _dateService = new FakeDateService(DateTime.UtcNow.AddDays(-10));
  }

  [Test]
  public async Task Return_NewestMeasurementsAndTheirJournal()
  {
    _repo.Journals.Add(new CounterJournal { Id = "counter-journal-id" });
    _repo.Measurements.Add(
      new CounterMeasurement
      {
        ParentId = "counter-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(2);

    _repo.Journals.Add(new GaugeJournal { Id = "gauge-journal-id" });
    _repo.Measurements.Add(
      new GaugeMeasurement
      {
        ParentId = "gauge-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(1);

    _repo.Journals.Add(new TimerJournal { Id = "timer-journal-id" });
    _repo.Measurements.Add(
      new TimerMeasurement
      {
        ParentId = "timer-journal-id",
        DateTime = _dateService.UtcNow
      }
    );

    var query = new GetActivitiesQuery { Limit = 2 };
    GetActivitiesQueryResult result = (await new GetActivitiesQueryExecutor(query).Execute(_repo));

    Assert.AreEqual(2, result.Journals.Length);
    Assert.IsFalse(result.Journals.Select(m => m.Id).Contains("counter-journal-id"));
    Assert.AreEqual(2, result.Measurements.Length);
    Assert.IsFalse(result.Measurements.Select(m => m.ParentId).Contains("counter-journal-id"));
  }
}
