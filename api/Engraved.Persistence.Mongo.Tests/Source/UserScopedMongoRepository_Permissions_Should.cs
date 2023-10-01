﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UserScopedMongoRepository_Permissions_Should
{
  private MongoRepository _repository = null!;
  private UserScopedMongoRepository _userScopedRepository = null!;

  private const string CurrentUserName = "me";

  private const string OtherUserName = "other";
  private string _otherUserId = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    await _repository.UpsertUser(new User { Name = CurrentUserName });
    _otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;

    _userScopedRepository = await Util.CreateUserScopedMongoRepository(CurrentUserName, true);
  }

  [Test]
  public async Task GetAllMetrics_Return_OnlyMy()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-metric" });
    await _repository.UpsertJournal(new CounterJournal { Name = "thy-metric", UserId = _otherUserId });

    IJournal[] allMetrics = await _userScopedRepository.GetAllJournals();

    Assert.AreEqual(1, allMetrics.Length);
    Assert.AreEqual("my-metric", allMetrics.First().Name);
  }

  [Test]
  public async Task GetAllMetrics_Return_OnlyMy_WhenOtherOtherUserHasPermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await _repository.ModifyJournalPermissions(
      otherMetric.EntityId,
      new Dictionary<string, PermissionKind> { { OtherUserName + "_another_one", PermissionKind.Write } }
    );

    IJournal[] allMetrics = await _userScopedRepository.GetAllJournals();

    Assert.AreEqual(1, allMetrics.Length);
  }

  [Test]
  public async Task GetAllMetrics_Return_MyAndThy_WhenIMoreThanEnoughHavePermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await GiveMePermissions(otherMetric.EntityId, PermissionKind.Write);

    IJournal[] allMetrics = await _userScopedRepository.GetAllJournals();

    Assert.AreEqual(2, allMetrics.Length);
  }

  [Test]
  public async Task GetAllMetrics_Return_MyAndThy_WhenIHavePermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await GiveMePermissions(otherMetric.EntityId, PermissionKind.Read);

    IJournal[] allMetrics = await _userScopedRepository.GetAllJournals();

    Assert.AreEqual(2, allMetrics.Length);
  }

  [Test]
  public async Task GetAllMeasurements_Return_OnlyMy_WhenOtherOtherUserHasPermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await _repository.ModifyJournalPermissions(
      otherMetric.EntityId,
      new Dictionary<string, PermissionKind> { { OtherUserName + "_another_one", PermissionKind.Write } }
    );

    await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = otherMetric.EntityId
      }
    );

    IMeasurement[] allMeasurements =
      await _userScopedRepository.GetAllMeasurements(otherMetric.EntityId, null, null, null);

    Assert.AreEqual(0, allMeasurements.Length);
  }

  [Test]
  public async Task GetAllMeasurements_Return_MyAndThy_WhenIHavePermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-metric" });

    UpsertResult otherMetric = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-metric", UserId = _otherUserId
      }
    );

    await GiveMePermissions(otherMetric.EntityId, PermissionKind.Read);

    await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = otherMetric.EntityId
      }
    );

    IMeasurement[] allMeasurements =
      await _userScopedRepository.GetAllMeasurements(otherMetric.EntityId, null, null, null);

    Assert.AreEqual(1, allMeasurements.Length);
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithNoPermissionsAtAll()
  {
    string metricId = await CreateMetricForOtherUser();

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithOnlyReadPermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithNonePermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
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

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertMetricAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMetric_Update_NotPossible_WithReadPermissions()
  {
    string metricId = await CreateMetricForOtherUser();

    await GiveMePermissions(metricId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertMetricAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMetric_Update_NotPossible_WithNonePermissions()
  {
    string metricId = await CreateMetricForOtherUser();

    await GiveMePermissions(metricId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
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

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_NotPossible_WithReadPermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddMeasurementAsMe(metricId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_NotPossible_WithNonePermissions()
  {
    string metricId = await CreateMetricForOtherUser();
    await GiveMePermissions(metricId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
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
    await _userScopedRepository.UpsertJournal(
      new CounterJournal { Id = metricId }
    );
  }

  private async Task<string> CreateMetricForOtherUser()
  {
    UpsertResult upsertResult = await _repository.UpsertJournal(
      new CounterJournal
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
        ParentId = metricId
      }
    );
  }

  private async Task UpsertOtherMeasurementAsMe(string metricId)
  {
    UpsertResult result = await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = metricId,
        UserId = _otherUserId,
        Notes = "foo"
      }
    );

    const string newNotesValues = "bar";

    await _userScopedRepository.UpsertMeasurement(
      new CounterMeasurement
      {
        Id = result.EntityId,
        ParentId = metricId,
        Notes = newNotesValues
      }
    );

    IMeasurement measurement = (await _repository.GetMeasurement(result.EntityId))!;
    Assert.AreEqual(newNotesValues, measurement.Notes);
  }

  private async Task GiveMePermissions(string metricId, PermissionKind kind)
  {
    await _repository.ModifyJournalPermissions(
      metricId,
      new Dictionary<string, PermissionKind> { { CurrentUserName, kind } }
    );
  }
}
