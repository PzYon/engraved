using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class GetAllEntriesQueryExecutorShould
{
  private FakeDateService _dateService = null!;
  private UserScopedInMemoryRepository _repo = null!;

  private const string UserId = "max";

  [SetUp]
  public void SetUp()
  {
    var inMemoryRepository = new InMemoryRepository();
    inMemoryRepository.Users.Add(
      new User
      {
        Id = UserId,
        Name = UserId
      }
    );

    _repo = new UserScopedInMemoryRepository(inMemoryRepository, new FakeCurrentUserService(UserId));
    _dateService = new FakeDateService(DateTime.UtcNow.AddDays(-10));
  }

  [Test]
  public async Task Return_NewestEntriesAndTheirJournal()
  {
    _repo.Journals.Add(new CounterJournal { Id = "counter-journal-id", UserId = UserId });
    _repo.Entries.Add(
      new CounterEntry
      {
        ParentId = "counter-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(2);

    _repo.Journals.Add(new GaugeJournal { Id = "gauge-journal-id", UserId = UserId });
    _repo.Entries.Add(
      new GaugeEntry
      {
        ParentId = "gauge-journal-id",
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(1);

    _repo.Journals.Add(new TimerJournal { Id = "timer-journal-id", UserId = UserId });
    _repo.Entries.Add(
      new TimerEntry
      {
        ParentId = "timer-journal-id",
        DateTime = _dateService.UtcNow
      }
    );

    var queryExecutor = new GetAllEntriesQueryExecutor(_repo);
    GetAllEntriesQueryResult result = await queryExecutor.Execute(new GetAllEntriesQuery { Limit = 2 });

    result.Journals.Length.Should().Be(2);
    result.Journals.Select(m => m.Id).Contains("counter-journal-id").Should().BeFalse();
    result.Entries.Length.Should().Be(2);
    result.Entries.Select(m => m.ParentId).Contains("counter-journal-id").Should().BeFalse();
  }
}
