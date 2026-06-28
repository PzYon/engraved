using System;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Entries.GetAll;

public class SearchEntriesQueryExecutorShould
{
  private FakeDateService _dateService = null!;
  private TestUserScopedMongoRepository _repo = null!;

  private const string UserId = TestIds.UserId;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserScopedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(
      new User
      {
        Id = UserId,
        Name = UserId
      }
    );

    _dateService = new FakeDateService(DateTime.UtcNow.AddDays(-10));
  }

  [Test]
  public async Task Return_NewestEntriesAndTheirJournal()
  {
    const string journal1Id = "60703c3b0000000000000011";
    const string journal2Id = "60703c3b0000000000000012";
    const string journal3Id = "60703c3b0000000000000013";

    await _repo.UpsertJournal(new CounterJournal { Id = journal1Id, UserId = UserId });
    await _repo.UpsertEntry(
      new CounterEntry
      {
        ParentId = journal1Id,
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(2);

    await _repo.UpsertJournal(new GaugeJournal { Id = journal2Id, UserId = UserId });
    await _repo.UpsertEntry(
      new GaugeEntry
      {
        ParentId = journal2Id,
        DateTime = _dateService.UtcNow
      }
    );
    _dateService.SetNext(1);

    await _repo.UpsertJournal(new TimerJournal { Id = journal3Id, UserId = UserId });
    await _repo.UpsertEntry(
      new TimerEntry
      {
        ParentId = journal3Id,
        DateTime = _dateService.UtcNow
      }
    );

    var queryExecutorRepo = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    await queryExecutorRepo.WakeMeUp();

    var queryExecutor = new SearchEntriesQueryExecutor(queryExecutorRepo);
    SearchEntriesQueryResult result = await queryExecutor.Execute(new SearchEntriesQuery { Limit = 2 });

    result.Journals.Length.Should().Be(2);
    result.Entries.Any(m => m.ParentId == journal1Id).Should().BeFalse();
    result.Journals.Any(m => m.Id == journal1Id).Should().BeFalse();
  }
}
