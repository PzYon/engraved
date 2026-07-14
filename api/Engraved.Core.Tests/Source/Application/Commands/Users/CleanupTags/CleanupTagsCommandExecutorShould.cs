using System.Threading.Tasks;
using Engraved.Core.Application.Commands.Users.CleanupTags;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Users.CleanupTags;

[TestFixture]
public class CleanupTagsCommandExecutorShould
{
  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserRestrictedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(
      new User
      {
        Id = UserId,
        Name = UserId
      }
    );
  }

  private TestUserRestrictedMongoRepository _repo = null!;

  private const string UserId = TestIds.UserId;

  [Test]
  public async Task DoesNotChangeAnything_When_No_Missing_Favorites()
  {
    const string journal1Id = "60703c3b00000000000000d1";
    const string journal2Id = "60703c3b00000000000000d2";
    await _repo.UpsertJournal(new CounterJournal { Id = journal1Id, UserId = UserId });
    await _repo.UpsertJournal(new CounterJournal { Id = journal2Id, UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "Tag1", JournalIds = [journal1Id] });
    user.Tags.Add(new UserTag { Id = "Tag2", JournalIds = [journal2Id] });
    await _repo.UpsertUser(user);

    var command = new CleanupTagsCommand { DryRun = false };
    var result =
      (CleanupTagsCommandResult)await new CleanupTagsCommandExecutor(_repo, _repo, _repo.CurrentUser).Execute(command);

    result.AffectedUserIds.Should().Contain(UserId);
    result.EntityId.Should().Be(UserId);
    result.DryRun.Should().Be(false);
    result.JournalIdsToRemove.Should().BeEmpty();
  }

  [Test]
  public async Task ReturnsImmediately_When_NoTagsOrNoJournalIdsInTags()
  {
    var result =
      (CleanupTagsCommandResult)await new CleanupTagsCommandExecutor(_repo, _repo, _repo.CurrentUser).Execute(
        new CleanupTagsCommand { DryRun = false }
      );

    result.JournalIdsToRemove.Should().BeEmpty();
  }

  [Test]
  public async Task User_With_Tags_But_No_JournalIds()
  {
    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "Tag1", JournalIds = [] });
    await _repo.UpsertUser(user);

    var result =
      (CleanupTagsCommandResult)await new CleanupTagsCommandExecutor(_repo, _repo, _repo.CurrentUser).Execute(
        new CleanupTagsCommand { DryRun = false }
      );
    result.JournalIdsToRemove.Should().BeEmpty();
  }

  [Test]
  public async Task RemovesMissingJournalIds_When_SomeAreMissing()
  {
    const string existingJournalId = "60703c3b00000000000000d3";
    const string missingJournalId = "60703c3b00000000000000f1";
    await _repo.UpsertJournal(new CounterJournal { Id = existingJournalId, UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "Tag1", JournalIds = [existingJournalId, missingJournalId] });
    await _repo.UpsertUser(user);

    TestUserRestrictedMongoRepository commandExecutorRepo =
      await Util.CreateUserRestrictedMongoRepository(UserId, UserId, true);
    var result =
      (CleanupTagsCommandResult)await new CleanupTagsCommandExecutor(
        commandExecutorRepo,
        commandExecutorRepo,
        commandExecutorRepo.CurrentUser
      ).Execute(
        new CleanupTagsCommand { DryRun = false }
      );

    result.JournalIdsToRemove.Should().Contain(missingJournalId);

    TestUserRestrictedMongoRepository verificationRepo =
      await Util.CreateUserRestrictedMongoRepository(UserId, UserId, true);
    user = (await verificationRepo.GetUser(UserId))!;
    user.Tags[0].JournalIds.Should().NotContain(missingJournalId);
    user.Tags[0].JournalIds.Should().Contain(existingJournalId);
  }

  [Test]
  public async Task RemovesMissingJournalIds_FromMultipleTag_When_SomeAreMissing()
  {
    const string existingJournalId1 = "60703c3b00000000000000d4";
    const string existingJournalId2 = "60703c3b00000000000000d5";
    const string missingJournalId1 = "60703c3b00000000000000f2";
    const string missingJournalId2 = "60703c3b00000000000000f3";
    await _repo.UpsertJournal(new CounterJournal { Id = existingJournalId1, UserId = UserId });
    await _repo.UpsertJournal(new CounterJournal { Id = existingJournalId2, UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(
      new UserTag { Id = "Tag1", JournalIds = [existingJournalId1, missingJournalId1] }
    );
    user.Tags.Add(
      new UserTag { Id = "Tag2", JournalIds = [existingJournalId2, missingJournalId2] }
    );
    await _repo.UpsertUser(user);

    TestUserRestrictedMongoRepository commandExecutorRepo =
      await Util.CreateUserRestrictedMongoRepository(UserId, UserId, true);
    var result =
      (CleanupTagsCommandResult)await new CleanupTagsCommandExecutor(
        commandExecutorRepo,
        commandExecutorRepo,
        commandExecutorRepo.CurrentUser
      ).Execute(
        new CleanupTagsCommand { DryRun = false }
      );

    result.JournalIdsToRemove.Should().Contain(missingJournalId1);
    result.JournalIdsToRemove.Should().Contain(missingJournalId2);
    result.JournalIdsToRemove.Should().HaveCount(2);

    TestUserRestrictedMongoRepository verificationRepo =
      await Util.CreateUserRestrictedMongoRepository(UserId, UserId, true);
    user = (await verificationRepo.GetUser(UserId))!;
    user.Tags[0].JournalIds.Should().NotContain(missingJournalId1);
    user.Tags[0].JournalIds.Should().NotContain(missingJournalId2);

    user.Tags[1].JournalIds.Should().NotContain(missingJournalId1);
    user.Tags[1].JournalIds.Should().NotContain(missingJournalId2);
  }

  [Test]
  public async Task PopulatesJournalIdsToRemove_ButDoesNotRemove_When_DryRunIsTrue()
  {
    const string existingJournalId = "60703c3b00000000000000d6";
    const string missingJournalId = "60703c3b00000000000000f4";
    await _repo.UpsertJournal(new CounterJournal { Id = existingJournalId, UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "Tag1", JournalIds = [existingJournalId, missingJournalId] });
    await _repo.UpsertUser(user);

    TestUserRestrictedMongoRepository commandExecutorRepo =
      await Util.CreateUserRestrictedMongoRepository(UserId, UserId, true);
    var result =
      (CleanupTagsCommandResult)await new CleanupTagsCommandExecutor(
        commandExecutorRepo,
        commandExecutorRepo,
        commandExecutorRepo.CurrentUser
      ).Execute(
        new CleanupTagsCommand { DryRun = true }
      );

    result.JournalIdsToRemove.Should().Contain(missingJournalId);

    TestUserRestrictedMongoRepository verificationRepo =
      await Util.CreateUserRestrictedMongoRepository(UserId, UserId, true);
    user = (await verificationRepo.GetUser(UserId))!;
    user.Tags[0].JournalIds.Should().Contain(missingJournalId);
    user.Tags[0].JournalIds.Should().Contain(existingJournalId);
  }
}
