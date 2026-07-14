using System.Threading.Tasks;
using Engraved.Api.Authentication;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils.Source;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Api.Tests.Authentication;

public class UserLoaderShould
{
  private const string UserName = "jane@doe.ch";

  private TestMongoRepository _repository = null!;
  private UserLoader _userLoader = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repository = await Util.CreateMongoRepository();
    _userLoader = new UserLoader(_repository);
  }

  [TearDown]
  public void TearDown()
  {
    _userLoader.Dispose();
  }

  [Test]
  public async Task ReturnUserFromRepository_OnFirstLoad()
  {
    await _repository.UpsertUser(new User { Name = UserName, DisplayName = "Jane" });

    IUser user = await _userLoader.GetUser(UserName);

    user.Name.Should().Be(UserName);
    user.DisplayName.Should().Be("Jane");
  }

  [Test]
  public async Task ServeCachedUser_WithoutHittingRepositoryAgain()
  {
    await _repository.UpsertUser(new User { Name = UserName, DisplayName = "Jane" });
    await _userLoader.GetUser(UserName);

    // change the underlying record; the cached instance must still be served
    IUser stored = (await _repository.GetUser(UserName))!;
    stored.DisplayName = "Changed";
    await _repository.UpsertUser(stored);

    IUser cached = await _userLoader.GetUser(UserName);

    cached.DisplayName.Should().Be("Jane");
  }

  [Test]
  public async Task ServeUpdatedUser_AfterSetUser()
  {
    await _repository.UpsertUser(new User { Name = UserName, DisplayName = "Jane" });
    await _userLoader.GetUser(UserName);

    _userLoader.SetUser(new User { Name = UserName, DisplayName = "Refreshed" });

    IUser user = await _userLoader.GetUser(UserName);

    user.DisplayName.Should().Be("Refreshed");
  }

  [Test]
  public void Throw_When_UserDoesNotExist()
  {
    Assert.ThrowsAsync<NotAllowedOperationException>(async () => await _userLoader.GetUser("nobody@nowhere.ch"));
  }

  [Test]
  public async Task NotCacheMisses_So_LaterCreatedUserIsFound()
  {
    // a miss must not be cached: the user may be created moments later (e.g. during login)
    Assert.ThrowsAsync<NotAllowedOperationException>(async () => await _userLoader.GetUser(UserName));

    await _repository.UpsertUser(new User { Name = UserName, DisplayName = "Jane" });

    IUser user = await _userLoader.GetUser(UserName);

    user.DisplayName.Should().Be("Jane");
  }
}
