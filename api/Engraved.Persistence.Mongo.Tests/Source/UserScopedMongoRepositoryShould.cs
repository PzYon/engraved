using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.DocumentTypes.Measurements;
using Engraved.Persistence.Mongo.DocumentTypes.Metrics;
using MongoDB.Driver;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UserScopedMongoRepositoryShould
{
  private TestMongoRepository _repository = null!;
  private TestUserScopedMongoRepository _userScopedRepository = null!;

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
  public async Task GetUser_Returns_CurrentUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userScopedRepository.GetUser(CurrentUserName);

    Assert.IsNotNull(user);
    Assert.AreEqual(CurrentUserName, user!.Name);
  }

  [Test]
  public async Task GetUser_DoesReturn_OtherUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userScopedRepository.GetUser(OtherUserName);

    Assert.IsNotNull(user);
  }

  [Test]
  public async Task GetUsers_Returns_RequestedUsers()
  {
    UpsertResult result1 = await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });
    UpsertResult result3 = await _repository.UpsertUser(new User { Name = "gusti" });

    IUser[] users = await _userScopedRepository.GetUsers(result1.EntityId, result3.EntityId);

    Assert.AreEqual(2, users.Length);
  }

  [Test]
  public async Task UpsertUser_ShouldUpdate_CurrentUser()
  {
    IUser? current = await _repository.GetUser(CurrentUserName);
    Assert.IsNotNull(current);

    UpsertResult result = await _userScopedRepository.UpsertUser(current!);

    Assert.AreEqual(_userScopedRepository.CurrentUser.Value.Id, result.EntityId);
  }

  [Test]
  public void UpsertUser_ShouldThrow_WhenUpdating_OtherUser()
  {
    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => await _userScopedRepository.UpsertUser(
        new User { Id = _otherUserId, Name = OtherUserName }
      )
    );
  }

  [Test]
  public async Task UpsertMetric_Ensures_CurrentUser_Id()
  {
    IJournal journal = new TimerJournal();

    UpsertResult result = await _userScopedRepository.UpsertJournal(journal);
    IJournal? createdMetric = await _repository.GetJournal(result.EntityId);

    Assert.AreEqual(result.EntityId, createdMetric!.Id);
    Assert.AreEqual(_currentUserId, createdMetric.UserId);
  }

  [Test]
  public async Task UpsertMetric_ThrowsWhen_EntityFromOtherUser()
  {
    UpsertResult result = await _repository.UpsertJournal(new TimerJournal { UserId = _otherUserId });

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () =>
      {
        await _userScopedRepository.UpsertJournal(
          new TimerJournal
          {
            Id = result.EntityId,
            Notes = "Random"
          }
        );
      }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Ensures_CurrentUser_Id()
  {
    UpsertResult upsertMetric = await _userScopedRepository.UpsertJournal(new TimerJournal());
    string metricId = upsertMetric.EntityId;

    IMeasurement measurement = new TimerMeasurement { ParentId = metricId };

    await _userScopedRepository.UpsertMeasurement(measurement);
    IMeasurement[] measurements = await _repository.GetAllMeasurements(metricId, null, null, null);

    Assert.True(measurements.All(m => m.UserId == _currentUserId));
  }

  [Test]
  public void UpsertMeasurement_ThrowsWhen_EntityFromOtherUser()
  {
    IMeasurement measurement = new TimerMeasurement
    {
      ParentId = MongoUtil.GenerateNewIdAsString(),
      UserId = _otherUserId
    };

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await _userScopedRepository.UpsertMeasurement(measurement); }
    );
  }

  [Test]
  public async Task GetMetric_ShouldLoadFrom_CurrentUser()
  {
    UpsertResult currentUserResult = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Current User",
        UserId = _currentUserId
      }
    );

    await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Other User",
        UserId = _otherUserId
      }
    );

    IJournal? metric = await _userScopedRepository.GetJournal(currentUserResult.EntityId);
    Assert.IsNotNull(metric);
    Assert.AreEqual(metric!.Name, "From Current User");
  }

  [Test]
  public async Task GetMetric_ShouldReturnNull_WhenLoadingFrom_OtherUser()
  {
    await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Current User",
        UserId = _currentUserId
      }
    );

    UpsertResult otherUserResult = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Other User",
        UserId = _otherUserId
      }
    );

    IJournal? metric = await _userScopedRepository.GetJournal(otherUserResult.EntityId);
    Assert.IsNull(metric);
  }

  [Test]
  public async Task GetAllMeasurements()
  {
    UpsertResult currentUserMetricResult =
      await _repository.UpsertJournal(new CounterJournal { UserId = _currentUserId });

    string currentUserMetricId = currentUserMetricResult.EntityId;

    UpsertResult otherUserMetricResult
      = await _repository.UpsertJournal(new CounterJournal { UserId = _otherUserId });

    string otherUserMetricId = otherUserMetricResult.EntityId;

    for (var i = 0; i < 10; i++)
    {
      await _repository.UpsertMeasurement(
        new CounterMeasurement
        {
          ParentId = currentUserMetricId,
          UserId = _currentUserId,
          Notes = i.ToString()
        }
      );

      await _repository.UpsertMeasurement(
        new CounterMeasurement
        {
          ParentId = otherUserMetricId,
          UserId = _otherUserId,
          Notes = i.ToString()
        }
      );
    }

    IMeasurement[] otherUserMeasurements =
      await _userScopedRepository.GetAllMeasurements(otherUserMetricId, null, null, null);

    Assert.IsEmpty(otherUserMeasurements);

    IMeasurement[] currentUserMeasurements =
      await _userScopedRepository.GetAllMeasurements(currentUserMetricId, null, null, null);

    Assert.AreEqual(10, currentUserMeasurements.Length);
  }

  [Test]
  public async Task DeleteMeasurement()
  {
    UpsertResult result = await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        UserId = _currentUserId,
        Notes = "WillBeDeleted"
      }
    );

    IMeasurement? measurement = await _repository.GetMeasurement(result.EntityId);
    Assert.IsNotNull(measurement);

    await _userScopedRepository.DeleteMeasurement(result.EntityId);

    measurement = await _repository.GetMeasurement(result.EntityId);
    Assert.IsNull(measurement);
  }

  [Test]
  public async Task DeleteMeasurement_ShouldNotDelete_FromOtherUser()
  {
    UpsertResult result = await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        UserId = _otherUserId,
        Notes = "WillBeDeleted"
      }
    );

    IMeasurement? measurement = await _repository.GetMeasurement(result.EntityId);
    Assert.IsNotNull(measurement);

    await _userScopedRepository.DeleteMeasurement(result.EntityId);
    Assert.IsNotNull(measurement);
  }

  [Test]
  public async Task DeleteMetric_AndItsMeasurements()
  {
    UpsertResult metric = await _repository.UpsertJournal(
      new CounterJournal
      {
        UserId = _currentUserId
      }
    );

    await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = metric.EntityId,
        UserId = _currentUserId
      }
    );

    Assert.AreEqual(1, await _repository.Journals.CountDocumentsAsync(FilterDefinition<JournalDocument>.Empty));
    Assert.AreEqual(
      1,
      await _repository.Measurements.CountDocumentsAsync(FilterDefinition<MeasurementDocument>.Empty)
    );

    await _repository.DeleteJournal(metric.EntityId);

    Assert.AreEqual(0, (await _repository.GetAllJournals()).Length);

    Assert.AreEqual(0, await _repository.Journals.CountDocumentsAsync(FilterDefinition<JournalDocument>.Empty));
    Assert.AreEqual(
      0,
      await _repository.Measurements.CountDocumentsAsync(FilterDefinition<MeasurementDocument>.Empty)
    );
  }
}
