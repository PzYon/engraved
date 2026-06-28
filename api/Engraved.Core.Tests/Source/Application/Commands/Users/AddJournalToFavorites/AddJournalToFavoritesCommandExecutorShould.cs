using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommandExecutorShould
{
  private TestUserScopedMongoRepository _repo = null!;

  private const string UserId = "6a40b7027bf30b7c135049b4";

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserScopedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(new User { Id = UserId, Name = UserId });
  }

  [Test]
  public async Task AddJournalToFavorites()
  {
    // when
    const string journalId = "60703c3b00000000000000d1";
    await new AddJournalToFavoritesCommandExecutor(_repo).Execute(
      new AddJournalToFavoritesCommand { JournalId = journalId }
    );

    // then
    (await _repo.GetUser(UserId))!.FavoriteJournalIds.Should().Contain(journalId);
  }

  [Test]
  public async Task NotAddDuplicate_When_AlreadyFavorite()
  {
    // given
    const string journalId = "60703c3b00000000000000d1";
    IUser user = (await _repo.GetUser(UserId))!;
    user.FavoriteJournalIds.Add(journalId);
    await _repo.UpsertUser(user);

    // when
    await new AddJournalToFavoritesCommandExecutor(_repo).Execute(
      new AddJournalToFavoritesCommand { JournalId = journalId }
    );

    // then
    (await _repo.GetUser(UserId))!.FavoriteJournalIds.Should().ContainSingle().Which.Should().Be(journalId);
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
