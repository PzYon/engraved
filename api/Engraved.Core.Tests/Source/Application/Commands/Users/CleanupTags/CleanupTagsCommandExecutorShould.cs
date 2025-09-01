using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.CleanupTags;

[TestFixture]
public class CleanupTagsCommandExecutorShould
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
  public async Task DoesNotChangeAnything_When_No_Missing_Favorites()
  {
    _repo.Journals.Add(new CounterJournal { Id = "counter-journal-id", UserId = UserId });
    _repo.Journals.Add(new CounterJournal { Id = "scrap-journal-id", UserId = UserId });

    _repo.Users[0].Tags.Add(new UserTag { Id = "Tag1", JournalIds = ["counter-journal-id"] });
    _repo.Users[0].Tags.Add(new UserTag { Id = "Tag2", JournalIds = ["scrap-journal-id"] });

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
    _repo.Users[0].Tags.Add(new UserTag { Id = "Tag1", JournalIds = [] });
    var result = (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(
      new CleanupTagsCommand { DryRun = false }
    );
    result.JournalIdsToRemove.Should().BeEmpty();
  }

  [Test]
  public async Task RemovesMissingJournalIds_When_SomeAreMissing()
  {
    _repo.Journals.Add(new CounterJournal { Id = "existing-journal-id", UserId = UserId });
    _repo.Users[0].Tags.Add(new UserTag { Id = "Tag1", JournalIds = ["existing-journal-id", "missing-journal-id"] });

    var result =
      (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(
        new CleanupTagsCommand { DryRun = false }
      );

    result.JournalIdsToRemove.Should().Contain("missing-journal-id");

    _repo.Users[0].Tags[0].JournalIds.Should().NotContain("missing-journal-id");
    _repo.Users[0].Tags[0].JournalIds.Should().Contain("existing-journal-id");
  }

  [Test]
  public async Task RemovesMissingJournalIds_FromMultipleTag_When_SomeAreMissing()
  {
    _repo.Journals.Add(new CounterJournal { Id = "existing-journal-id-1", UserId = UserId });
    _repo.Journals.Add(new CounterJournal { Id = "existing-journal-id-2", UserId = UserId });

    _repo.Users[0]
      .Tags.Add(
        new UserTag { Id = "Tag1", JournalIds = ["existing-journal-id-1", "missing-journal-id-1"] }
      );
    _repo.Users[0]
      .Tags.Add(
        new UserTag { Id = "Tag2", JournalIds = ["existing-journal-id-2", "missing-journal-id-2"] }
      );

    var result =
      (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(
        new CleanupTagsCommand { DryRun = false }
      );

    result.JournalIdsToRemove.Should().Contain("missing-journal-id-1");
    result.JournalIdsToRemove.Should().Contain("missing-journal-id-2");
    result.JournalIdsToRemove.Should().HaveCount(2);

    _repo.Users[0].Tags[0].JournalIds.Should().NotContain("missing-journal-id-1");
    _repo.Users[0].Tags[0].JournalIds.Should().NotContain("missing-journal-id-2");

    _repo.Users[0].Tags[1].JournalIds.Should().NotContain("missing-journal-id-1");
    _repo.Users[0].Tags[1].JournalIds.Should().NotContain("missing-journal-id-2");
  }

  [Test]
  public async Task PopulatesJournalIdsToRemove_ButDoesNotRemove_When_DryRunIsTrue()
  {
    _repo.Journals.Add(new CounterJournal { Id = "existing-journal-id", UserId = UserId });
    _repo.Users[0].Tags.Add(new UserTag { Id = "Tag1", JournalIds = ["existing-journal-id", "missing-journal-id"] });

    var result =
      (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(
        new CleanupTagsCommand { DryRun = true }
      );

    result.JournalIdsToRemove.Should().Contain("missing-journal-id");
    _repo.Users[0].Tags[0].JournalIds.Should().Contain("missing-journal-id");
    _repo.Users[0].Tags[0].JournalIds.Should().Contain("existing-journal-id");
  }
}
