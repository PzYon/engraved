using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.Permissions;
using Metrix.Core.Domain.User;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

public class UserScopedMongoRepository_Permissions_Should
{
  private MongoRepository _repository = null!;
  private UserScopedMongoRepository _userScopedRepository = null!;

  private const string CurrentUserName = "me";
  private string _currentUserId = null!;

  private const string OtherUserName = "other";
  private string _otherUserId = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    _currentUserId = (await _repository.UpsertUser(new User { Name = CurrentUserName })).EntityId;
    _otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;

    _userScopedRepository = await Util.CreateUserScopedMongoRepository(CurrentUserName, true);
  }

  [Test]
  public async Task Return_OnlyMy()
  {
    await _userScopedRepository.UpsertMetric(new CounterMetric { Name = "my-metric" });
    await _repository.UpsertMetric(new CounterMetric { Name = "thy-metric", UserId = _otherUserId });

    IMetric[] allMetrics = await _userScopedRepository.GetAllMetrics();

    Assert.AreEqual(1, allMetrics.Length);
    Assert.AreEqual("my-metric", allMetrics.First().Name);
  }
  
  [Test]
  public async Task Return_OnlyMy_WhenOtherOtherUserHasPermissions()
  {
    await _userScopedRepository.UpsertMetric(new CounterMetric { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await _repository.ModifyMetricPermissions(
      otherMetric.EntityId,
      new Permissions { { _otherUserId + "_another_one", PermissionKind.Write } }
    );

    IMetric[] allMetrics = await _userScopedRepository.GetAllMetrics();

    Assert.AreEqual(1, allMetrics.Length);
  }


  [Test]
  public async Task Return_MyAndThy_WhenIMoreThanEnoughHavePermissions()
  {
    await _userScopedRepository.UpsertMetric(new CounterMetric { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await _repository.ModifyMetricPermissions(
      otherMetric.EntityId,
      new Permissions { { _currentUserId, PermissionKind.Write } }
    );

    IMetric[] allMetrics = await _userScopedRepository.GetAllMetrics();

    Assert.AreEqual(2, allMetrics.Length);
  }

  [Test]
  public async Task Return_MyAndThy_WhenIHavePermissions()
  {
    await _userScopedRepository.UpsertMetric(new CounterMetric { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await _repository.ModifyMetricPermissions(
      otherMetric.EntityId,
      new Permissions { { _currentUserId, PermissionKind.Read } }
    );

    IMetric[] allMetrics = await _userScopedRepository.GetAllMetrics();

    Assert.AreEqual(2, allMetrics.Length);
  }
}
