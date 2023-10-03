using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class GetAllEntriesQueryExecutorShould
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
  public async Task Return_NewestEntriesAndTheirJournal()
  {
    _repo.Journals.Add(new CounterJournal { Id = "counter-journal-id" });
    _repo.Entries.Add(
      new CounterEntry
      {
        ParentId = "counter-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(2);

    _repo.Journals.Add(new GaugeJournal { Id = "gauge-journal-id" });
    _repo.Entries.Add(
      new GaugeEntry
      {
        ParentId = "gauge-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(1);

    _repo.Journals.Add(new TimerJournal { Id = "timer-journal-id" });
    _repo.Entries.Add(
      new TimerEntry
      {
        ParentId = "timer-journal-id",
        DateTime = _dateService.UtcNow
      }
    );

    var query = new GetAllEntriesQuery { Limit = 2 };
    GetAllEntriesQueryResult result = (await new GetAllEntriesQueryExecutor(query).Execute(_repo));

    Assert.AreEqual(2, result.Journals.Length);
    Assert.IsFalse(result.Journals.Select(m => m.Id).Contains("counter-journal-id"));
    Assert.AreEqual(2, result.Entries.Length);
    Assert.IsFalse(result.Entries.Select(m => m.ParentId).Contains("counter-journal-id"));
  }
}
