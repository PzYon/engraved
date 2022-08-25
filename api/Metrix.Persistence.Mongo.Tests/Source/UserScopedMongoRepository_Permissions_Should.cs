using System.Linq;
using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
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
  public async Task GetAllMetrics_Return_OnlyMy()
  {
    await _userScopedRepository.UpsertMetric(new CounterMetric { Name = "my-metric" });
    await _repository.UpsertMetric(new CounterMetric { Name = "thy-metric", UserId = _otherUserId });

    IMetric[] allMetrics = await _userScopedRepository.GetAllMetrics();

    Assert.AreEqual(1, allMetrics.Length);
    Assert.AreEqual("my-metric", allMetrics.First().Name);
  }

  [Test]
  public async Task GetAllMetrics_Return_OnlyMy_WhenOtherOtherUserHasPermissions()
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
  public async Task GetAllMetrics_Return_MyAndThy_WhenIMoreThanEnoughHavePermissions()
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
  public async Task GetAllMetrics_Return_MyAndThy_WhenIHavePermissions()
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

  [Test]
  public async Task GetAllMeasurements_Return_OnlyMy_WhenOtherOtherUserHasPermissions()
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

    await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        MetricId = otherMetric.EntityId
      }
    );

    IMeasurement[] allMeasurements = await _userScopedRepository.GetAllMeasurements(otherMetric.EntityId);

    Assert.AreEqual(0, allMeasurements.Length);
  }

  [Test]
  public async Task GetAllMeasurements_Return_MyAndThy_WhenIHavePermissions()
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

    await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        MetricId = otherMetric.EntityId
      }
    );

    IMeasurement[] allMeasurements = await _userScopedRepository.GetAllMeasurements(otherMetric.EntityId);

    Assert.AreEqual(1, allMeasurements.Length);
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithNoPermissionsAtAll()
  {
    string metricId = await CreateMetricForOtherUser();

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithOnlyReadPermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.Read);

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithNonePermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.None);

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_Possible_WithWritePermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.Write);

    await UpsertOtherMeasurementAsMe(metricId);
  }

  [Test]
  public async Task UpsertMetric_Update_NotPossible_WithNoPermissionsAtAll()
  {
    string metricId = await CreateMetricForOtherUser();

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await UpsertMetricAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMetric_Update_NotPossible_WithReadPermissions()
  {
    string metricId = await CreateMetricForOtherUser();

    await GiveMePermissions(metricId, PermissionKind.Read);

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await UpsertMetricAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMetric_Update_NotPossible_WithNonePermissions()
  {
    string metricId = await CreateMetricForOtherUser();

    await GiveMePermissions(metricId, PermissionKind.None);

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await UpsertMetricAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMetric_Update_Possible_WithWritePermissions()
  {
    string metricId = await CreateMetricForOtherUser();

    await GiveMePermissions(metricId, PermissionKind.Write);

    await UpsertMetricAsMe(metricId);
  }

  [Test]
  public async Task UpsertMeasurement_Add_NotPossible_WithNoPermissionsAtAll()
  {
    string metricId = await CreateMetricForOtherUser();

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await AddMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_NotPossible_WithReadPermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.Read);

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await AddMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_NotPossible_WithNonePermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.None);

    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => { await AddMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_Possible_WithWritePermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.Write);

    await AddMeasurementAsMe(metricId);
  }

  private async Task UpsertMetricAsMe(string metricId)
  {
    await _userScopedRepository.UpsertMetric(
      new CounterMetric { Id = metricId }
    );
  }

  private async Task<string> CreateMetricForOtherUser()
  {
    UpsertResult upsertResult = await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    return upsertResult.EntityId;
  }

  private async Task AddMeasurementAsMe(string metricId)
  {
    await _userScopedRepository.UpsertMeasurement(
      new CounterMeasurement
      {
        MetricId = metricId
      }
    );
  }

  private async Task UpsertOtherMeasurementAsMe(string metricId)
  {
    UpsertResult result = await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        MetricId = metricId,
        UserId = _otherUserId,
        Notes = "foo"
      }
    );

    const string newNotesValues = "bar";

    await _userScopedRepository.UpsertMeasurement(
      new CounterMeasurement
      {
        Id = result.EntityId,
        MetricId = metricId,
        Notes = newNotesValues
      }
    );

    IMeasurement? measurement = (await _repository.GetMeasurement(result.EntityId))!;
    Assert.AreEqual(newNotesValues, measurement.Notes);
  }

  private async Task GiveMePermissions(string metricId, PermissionKind kind)
  {
    await _repository.ModifyMetricPermissions(
      metricId,
      new Permissions
      {
        { _currentUserId, kind }
      }
    );
  }
}
