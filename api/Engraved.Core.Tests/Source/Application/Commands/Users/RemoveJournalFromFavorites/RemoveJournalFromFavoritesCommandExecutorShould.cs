using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommandExecutorShould
{
  private UserScopedInMemoryRepository _repo = null!;

  private const string UserId = "max";

  [SetUp]
  public void SetUp()
  {
    var inMemoryRepository = new InMemoryRepository();
    inMemoryRepository.Users.Add(new User { Id = UserId, Name = UserId });
    _repo = new UserScopedInMemoryRepository(inMemoryRepository, new FakeCurrentUserService(UserId));
  }

  [Test]
  public async Task RemoveJournalFromFavorites()
  {
    // given
    _repo.Users[0].FavoriteJournalIds.Add("journal-id");

    // when
    await new RemoveJournalFromFavoritesCommandExecutor(_repo).Execute(
      new RemoveJournalFromFavoritesCommand { JournalId = "journal-id" }
    );

    // then
    _repo.Users[0].FavoriteJournalIds.Should().NotContain("journal-id");
  }

  [Test]
  public async Task DoNothing_When_NotAFavorite()
  {
    // given
    _repo.Users[0].FavoriteJournalIds.Add("other-journal-id");

    // when
    await new RemoveJournalFromFavoritesCommandExecutor(_repo).Execute(
      new RemoveJournalFromFavoritesCommand { JournalId = "journal-id" }
    );

    // then
    _repo.Users[0].FavoriteJournalIds.Should().ContainSingle().Which.Should().Be("other-journal-id");
  }

  [Test]
  public async Task Throw_When_JournalIdIsEmpty()
  {
    Func<Task> act = () => new RemoveJournalFromFavoritesCommandExecutor(_repo).Execute(
      new RemoveJournalFromFavoritesCommand { JournalId = "" }
    );

    await act.Should().ThrowAsync<InvalidCommandException>();
  }
}
