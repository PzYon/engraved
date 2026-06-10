using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommandExecutorShould
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
  public async Task AddJournalToFavorites()
  {
    // when
    await new AddJournalToFavoritesCommandExecutor(_repo).Execute(
      new AddJournalToFavoritesCommand { JournalId = "journal-id" }
    );

    // then
    _repo.Users[0].FavoriteJournalIds.Should().Contain("journal-id");
  }

  [Test]
  public async Task NotAddDuplicate_When_AlreadyFavorite()
  {
    // given
    _repo.Users[0].FavoriteJournalIds.Add("journal-id");

    // when
    await new AddJournalToFavoritesCommandExecutor(_repo).Execute(
      new AddJournalToFavoritesCommand { JournalId = "journal-id" }
    );

    // then
    _repo.Users[0].FavoriteJournalIds.Should().ContainSingle().Which.Should().Be("journal-id");
  }

  [Test]
  public async Task Throw_When_JournalIdIsEmpty()
  {
    Func<Task> act = () => new AddJournalToFavoritesCommandExecutor(_repo).Execute(
      new AddJournalToFavoritesCommand { JournalId = "" }
    );

    await act.Should().ThrowAsync<InvalidCommandException>();
  }
}
