using System.Threading.Tasks;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.CleanupTags;

[TestFixture]
public class CleanupTagsCommandExecutorShould
{
  private TestUserScopedMongoRepository _repo = null!;

  private const string UserId = "6a40b7027bf30b7c135049b4";

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
  }

  [Test]
  public async Task DoesNotChangeAnything_When_No_Missing_Favorites()
  {
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b00000000000000d1", UserId = UserId });
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b00000000000000d2", UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "Tag1", JournalIds = ["60703c3b00000000000000d1"] });
    user.Tags.Add(new UserTag { Id = "Tag2", JournalIds = ["60703c3b00000000000000d2"] });
    await _repo.UpsertUser(user);

    // must ensure permissions are granted for CleanupTags as it uses GetJournal(id, PermissionKind.Read)
    // but in UserScopedMongoRepository, being the owner (UserId == Journal.UserId) is enough.
    // wait, CleanupTags uses _repo.GetJournal(...) - wait, I need to check CleanupTagsCommandExecutor.

    var command = new CleanupTagsCommand { DryRun = false };
    var result = (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(command);

    result.AffectedUserIds.Should().Contain(UserId);
    result.EntityId.Should().Be(UserId);
    result.DryRun.Should().Be(false);
    result.JournalIdsToRemove.Should().BeEmpty();
  }

  [Test]
  public async Task ReturnsImmediately_When_NoTagsOrNoJournalIdsInTags()
  {
    var result =
      (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(
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

    var result = (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(
      new CleanupTagsCommand { DryRun = false }
    );
    result.JournalIdsToRemove.Should().BeEmpty();
  }

  [Test]
  public async Task RemovesMissingJournalIds_When_SomeAreMissing()
  {
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b00000000000000d3", UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "Tag1", JournalIds = ["60703c3b00000000000000d3", "60703c3b00000000000000f1"] });
    await _repo.UpsertUser(user);

    var commandExecutorRepo = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    await commandExecutorRepo.WakeMeUp();
    var result =
      (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(commandExecutorRepo).Execute(
        new CleanupTagsCommand { DryRun = false }
      );

    result.JournalIdsToRemove.Should().Contain("60703c3b00000000000000f1");

    var verificationRepo = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    await verificationRepo.WakeMeUp();
    user = (await verificationRepo.GetUser(UserId))!;
    user.Tags[0].JournalIds.Should().NotContain("60703c3b00000000000000f1");
    user.Tags[0].JournalIds.Should().Contain("60703c3b00000000000000d3");
  }

  [Test]
  public async Task RemovesMissingJournalIds_FromMultipleTag_When_SomeAreMissing()
  {
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b00000000000000d4", UserId = UserId });
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b00000000000000d5", UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(
      new UserTag { Id = "Tag1", JournalIds = ["60703c3b00000000000000d4", "60703c3b00000000000000f2"] }
    );
    user.Tags.Add(
      new UserTag { Id = "Tag2", JournalIds = ["60703c3b00000000000000d5", "60703c3b00000000000000f3"] }
    );
    await _repo.UpsertUser(user);

    var commandExecutorRepo = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    await commandExecutorRepo.WakeMeUp();
    var result =
      (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(commandExecutorRepo).Execute(
        new CleanupTagsCommand { DryRun = false }
      );

    result.JournalIdsToRemove.Should().Contain("60703c3b00000000000000f2");
    result.JournalIdsToRemove.Should().Contain("60703c3b00000000000000f3");
    result.JournalIdsToRemove.Should().HaveCount(2);

    var verificationRepo = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    await verificationRepo.WakeMeUp();
    user = (await verificationRepo.GetUser(UserId))!;
    user.Tags[0].JournalIds.Should().NotContain("60703c3b00000000000000f2");
    user.Tags[0].JournalIds.Should().NotContain("60703c3b00000000000000f3");

    user.Tags[1].JournalIds.Should().NotContain("60703c3b00000000000000f2");
    user.Tags[1].JournalIds.Should().NotContain("60703c3b00000000000000f3");
  }

  [Test]
  public async Task PopulatesJournalIdsToRemove_ButDoesNotRemove_When_DryRunIsTrue()
  {
    await _repo.UpsertJournal(new CounterJournal { Id = "60703c3b00000000000000d6", UserId = UserId });

    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "Tag1", JournalIds = ["60703c3b00000000000000d6", "60703c3b00000000000000f4"] });
    await _repo.UpsertUser(user);

    var commandExecutorRepo = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    await commandExecutorRepo.WakeMeUp();
    var result =
      (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(commandExecutorRepo).Execute(
        new CleanupTagsCommand { DryRun = true }
      );

    result.JournalIdsToRemove.Should().Contain("60703c3b00000000000000f4");

    var verificationRepo = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    await verificationRepo.WakeMeUp();
    user = (await verificationRepo.GetUser(UserId))!;
    user.Tags[0].JournalIds.Should().Contain("60703c3b00000000000000f4");
    user.Tags[0].JournalIds.Should().Contain("60703c3b00000000000000d6");
  }
}
