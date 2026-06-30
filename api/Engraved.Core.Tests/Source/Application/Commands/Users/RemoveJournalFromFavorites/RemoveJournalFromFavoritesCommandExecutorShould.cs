using System;
using System.Threading.Tasks;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;

public class RemoveJournalFromFavoritesCommandExecutorShould
{
  private TestUserScopedMongoRepository _repo = null!;

  private const string UserId = TestIds.UserId;
  private const string JournalId = "60703c3b00000000000000d1";

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserScopedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(new User { Id = UserId, Name = UserId });
  }

  [Test]
  public async Task RemoveJournalFromFavorites()
  {
    // given
    IUser user = (await _repo.GetUser(UserId))!;
    user.FavoriteJournalIds.Add(JournalId);
    await _repo.UpsertUser(user);

    var repositoryWithDifferentCache = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);

    // when
    await new RemoveJournalFromFavoritesCommandExecutor(repositoryWithDifferentCache).Execute(
      new RemoveJournalFromFavoritesCommand { JournalId = JournalId }
    );

    // then
    var secondRepoForVerification = await Util.CreateUserScopedMongoRepository(UserId, UserId, true);
    IUser updatedUser = (await secondRepoForVerification.GetUser(UserId))!;
    updatedUser.Id.Should().Be(UserId);
    updatedUser.FavoriteJournalIds.Should().NotContain(JournalId);
  }

  [Test]
  public async Task DoNothing_When_NotAFavorite()
  {
    // given
    const string otherJournalId = "60703c3b00000000000000d2";
    IUser user = (await _repo.GetUser(UserId))!;
    user.FavoriteJournalIds.Add(otherJournalId);
    await _repo.UpsertUser(user);

    // when
    await new RemoveJournalFromFavoritesCommandExecutor(_repo).Execute(
      new RemoveJournalFromFavoritesCommand { JournalId = JournalId }
    );

    // then
    (await _repo.GetUser(UserId))!.FavoriteJournalIds.Should().ContainSingle().Which.Should().Be(otherJournalId);
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
