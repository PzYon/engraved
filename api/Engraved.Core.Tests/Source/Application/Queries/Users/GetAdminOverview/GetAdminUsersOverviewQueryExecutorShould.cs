using System.Threading.Tasks;
using Engraved.Core.Application.Queries.Users.GetAdminOverview;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Queries.Users.GetAdminOverview;

public class GetAdminUsersOverviewQueryExecutorShould
{
  private const string UserId = "60703c3b0000000000000001";
  private const string JournalId = "60703c3b0000000000000002";
  private const string OtherJournalId = "60703c3b0000000000000003";

  private TestMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task ReturnEachUser_With_JournalAndEntryCounts()
  {
    // given
    await _repo.UpsertUser(new User { Id = UserId, Name = "someone@x.com", DisplayName = "Someone" });
    await _repo.UpsertJournal(new CounterJournal { Id = JournalId, UserId = UserId });
    await _repo.UpsertJournal(new CounterJournal { Id = OtherJournalId, UserId = UserId });
    await _repo.UpsertEntry(new CounterEntry { ParentId = JournalId });
    await _repo.UpsertEntry(new CounterEntry { ParentId = JournalId });
    await _repo.UpsertEntry(new CounterEntry { ParentId = OtherJournalId });

    // when
    AdminUserOverview[] result = await new GetAdminUsersOverviewQueryExecutor(_repo).Execute(
      new GetAdminUsersOverviewQuery()
    );

    // then
    result.Should().ContainSingle();

    AdminUserOverview overview = result[0];
    overview.Id.Should().Be(UserId);
    overview.Name.Should().Be("someone@x.com");
    overview.DisplayName.Should().Be("Someone");
    overview.JournalsCount.Should().Be(2);
    overview.EntriesCount.Should().Be(3);
  }

  [Test]
  public async Task ReturnZeroCounts_ForUserWithoutJournals()
  {
    // given
    await _repo.UpsertUser(new User { Id = UserId, Name = "someone@x.com" });

    // when
    AdminUserOverview[] result = await new GetAdminUsersOverviewQueryExecutor(_repo).Execute(
      new GetAdminUsersOverviewQuery()
    );

    // then
    result.Should().ContainSingle();
    result[0].JournalsCount.Should().Be(0);
    result[0].EntriesCount.Should().Be(0);
  }
}
