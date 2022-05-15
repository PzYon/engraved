using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.User;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

// [Ignore("Requires local MongoDB.")]
public class UserScopedMongoRepositoryShould
{
  private MongoRepository _repository = null!;
  private UserScopedMongoRepository _userScopedRepository = null!;

  private static readonly string currentUserName = "me";
  private static readonly string otherUserName = "other";

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    _userScopedRepository = await Util.CreateUserScopedMongoRepository(currentUserName, true);
  }

  [Test]
  public async Task GetUser_Returns_CurrentUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = otherUserName });
    await _repository.UpsertUser(new User { Name = currentUserName });
    await _repository.UpsertUser(new User { Name = "maz" });

    IUser? user = await _userScopedRepository.GetUser(currentUserName);

    Assert.IsNotNull(user);
    Assert.AreEqual(currentUserName, user.Name);
  }

  [Test]
  public async Task GetUser_DoesNotReturn_OtherUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = otherUserName });
    await _repository.UpsertUser(new User { Name = currentUserName });
    await _repository.UpsertUser(new User { Name = "maz" });

    IUser? user = await _userScopedRepository.GetUser(otherUserName);

    Assert.IsNull(user);
  }

  [Test]
  public async Task UpsertUser_ShouldUpdate_CurrentUser()
  {
    await _repository.UpsertUser(new User { Name = otherUserName });
    await _repository.UpsertUser(new User { Name = currentUserName });

    IUser? current = await _repository.GetUser(currentUserName);
    Assert.IsNotNull(current!);

    UpsertResult result = await _userScopedRepository.UpsertUser(current);

    Assert.AreEqual(_userScopedRepository.CurrentUser.Value.Id, result.EntityId);
  }

  [Test]
  public async Task UpsertUser_ShouldThrow_WhenUpdating_OtherUser()
  {
    var other = new User { Name = otherUserName };
    await _repository.UpsertUser(other);

    await _repository.UpsertUser(new User { Name = currentUserName });

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => await _userScopedRepository.UpsertUser(other)
    );
  }
}
