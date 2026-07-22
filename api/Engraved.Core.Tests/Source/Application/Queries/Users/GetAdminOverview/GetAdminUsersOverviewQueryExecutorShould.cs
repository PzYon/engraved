using System;
using System.Linq;
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
  private const string OtherUserId = "60703c3b0000000000000004";
  private const string ThirdUserId = "60703c3b0000000000000005";
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
    AdminUserItem[] result = await new GetAdminUsersOverviewQueryExecutor(_repo).Execute(
      new GetAdminUsersOverviewQuery()
    );

    // then
    result.Should().ContainSingle();

    AdminUserItem item = result[0];
    item.Id.Should().Be(UserId);
    item.Name.Should().Be("someone@x.com");
    item.DisplayName.Should().Be("Someone");
    item.JournalsCount.Should().Be(2);
    item.EntriesCount.Should().Be(3);
  }

  [Test]
  public async Task ReturnZeroCounts_ForUserWithoutJournals()
  {
    // given
    await _repo.UpsertUser(new User { Id = UserId, Name = "someone@x.com" });

    // when
    AdminUserItem[] result = await new GetAdminUsersOverviewQueryExecutor(_repo).Execute(
      new GetAdminUsersOverviewQuery()
    );

    // then
    result.Should().ContainSingle();
    result[0].JournalsCount.Should().Be(0);
    result[0].EntriesCount.Should().Be(0);
  }

  [Test]
  public async Task Return_MostRecentlyLoggedInUsersFirst()
  {
    // given
    await _repo.UpsertUser(
      new User { Id = UserId, Name = "oldest@x.com", LastLoginDate = new DateTime(2026, 1, 1) }
    );
    await _repo.UpsertUser(
      new User { Id = OtherUserId, Name = "newest@x.com", LastLoginDate = new DateTime(2026, 3, 1) }
    );
    await _repo.UpsertUser(
      new User { Id = ThirdUserId, Name = "never-logged-in@x.com", LastLoginDate = null }
    );

    // when
    AdminUserItem[] result = await new GetAdminUsersOverviewQueryExecutor(_repo).Execute(
      new GetAdminUsersOverviewQuery()
    );

    // then
    result.Select(i => i.Name)
      .Should()
      .Equal("newest@x.com", "oldest@x.com", "never-logged-in@x.com");
  }
}
