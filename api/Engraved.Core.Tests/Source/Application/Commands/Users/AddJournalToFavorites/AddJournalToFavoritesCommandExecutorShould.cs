using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Users.AddJournalToFavorites;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Users.AddJournalToFavorites;

public class AddJournalToFavoritesCommandExecutorShould
{
  private const string UserId = TestIds.UserId;
  private const string JournalId = "60703c3b00000000000000d1";
  private TestUserRestrictedMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserRestrictedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(new User { Id = UserId, Name = UserId });
  }

  [Test]
  public async Task AddJournalToFavorites()
  {
    // when
    await new AddJournalToFavoritesCommandExecutor(_repo, _repo.CurrentUser).Execute(
      new AddJournalToFavoritesCommand { JournalId = JournalId }
    );

    // then
    (await _repo.GetUser(UserId))!.FavoriteJournalIds.Should().Contain(JournalId);
  }

  [Test]
  public async Task NotAddDuplicate_When_AlreadyFavorite()
  {
    // given
    IUser user = (await _repo.GetUser(UserId))!;
    user.FavoriteJournalIds.Add(JournalId);
    await _repo.UpsertUser(user);

    // when
    await new AddJournalToFavoritesCommandExecutor(_repo, _repo.CurrentUser).Execute(
      new AddJournalToFavoritesCommand { JournalId = JournalId }
    );

    // then
    (await _repo.GetUser(UserId))!.FavoriteJournalIds.Should().ContainSingle().Which.Should().Be(JournalId);
  }

  [Test]
  public async Task Throw_When_JournalIdIsEmpty()
  {
    Func<Task> act = () => new AddJournalToFavoritesCommandExecutor(_repo, _repo.CurrentUser).Execute(
      new AddJournalToFavoritesCommand { JournalId = "" }
    );

    await act.Should().ThrowAsync<InvalidCommandException>();
  }
}
