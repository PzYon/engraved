using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.CleanupTags;

[TestFixture]
public class CleanupTagsShould
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
  public async Task Foo()
  {
    _repo.Journals.Add(new CounterJournal { Id = "counter-journal-id", UserId = UserId });
    _repo.Journals.Add(new CounterJournal { Id = "scrap-journal-id", UserId = UserId });

    _repo.Users[0].FavoriteJournalIds.AddRange(["counter-journal-id", "scrap-journal-id"]);

    var command = new CleanupTagsCommand { DryRun = false };
    var result = (CleanupTagsCommandResult) await new CleanupTagsCommandExecutor(_repo).Execute(command);

    result.AffectedUserIds.Should().Contain(UserId);
    result.EntityId.Should().Be(UserId);
    result.DryRun.Should().Be(false);
    result.JournalIdsToRemove.Should().BeEmpty();
  }
}
