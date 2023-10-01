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
  public async Task Return_NewestMeasurementsAndTheirMetric()
  {
    _repo.Journals.Add(new CounterJournal { Id = "counter-metric-id" });
    _repo.Measurements.Add(
      new CounterMeasurement
      {
        ParentId = "counter-metric-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(2);

    _repo.Journals.Add(new GaugeJournal { Id = "gauge-metric-id" });
    _repo.Measurements.Add(
      new GaugeMeasurement
      {
        ParentId = "gauge-metric-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(1);

    _repo.Journals.Add(new TimerJournal { Id = "timer-metric-id" });
    _repo.Measurements.Add(
      new TimerMeasurement
      {
        ParentId = "timer-metric-id",
        DateTime = _dateService.UtcNow
      }
    );

    var query = new GetActivitiesQuery { Limit = 2 };
    GetActivitiesQueryResult result = (await new GetActivitiesQueryExecutor(query).Execute(_repo));

    Assert.AreEqual(2, result.Journals.Length);
    Assert.IsFalse(result.Journals.Select(m => m.Id).Contains("counter-metric-id"));
    Assert.AreEqual(2, result.Measurements.Length);
    Assert.IsFalse(result.Measurements.Select(m => m.ParentId).Contains("counter-metric-id"));
  }
}
