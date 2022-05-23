using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;
using Metrix.Core.Domain.User;
using MongoDB.Bson;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

// [Ignore("Requires local MongoDB.")]
public class UserScopedMongoRepositoryShould
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
  public async Task GetUser_Returns_CurrentUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userScopedRepository.GetUser(CurrentUserName);

    Assert.IsNotNull(user);
    Assert.AreEqual(CurrentUserName, user!.Name);
  }

  [Test]
  public async Task GetUser_DoesNotReturn_OtherUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userScopedRepository.GetUser(OtherUserName);

    Assert.IsNull(user);
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
    Assert.ThrowsAsync<UnallowedOperationException>(
      async () => await _userScopedRepository.UpsertUser(
        new User { Id = _otherUserId, Name = OtherUserName }
      )
    );
  }

  [Test]
  public async Task GetMetric_ShouldLoadFrom_CurrentUser()
  {
    UpsertResult currentUserResult = await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "From Current User",
        UserId = _currentUserId
      }
    );

    await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "From Other User",
        UserId = _otherUserId
      }
    );

    IMetric? metric = await _userScopedRepository.GetMetric(currentUserResult.EntityId);
    Assert.IsNotNull(metric);
    Assert.AreEqual(metric!.Name, "From Current User");
  }

  [Test]
  public async Task GetMetric_ShouldReturnNull_WhenLoadingFrom_OtherUser()
  {
    await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "From Current User",
        UserId = _currentUserId
      }
    );

    UpsertResult otherUserResult = await _repository.UpsertMetric(
      new CounterMetric
      {
        Name = "From Other User",
        UserId = _otherUserId
      }
    );

    IMetric? metric = await _userScopedRepository.GetMetric(otherUserResult.EntityId);
    Assert.IsNull(metric);
  }

  [Test]
  public async Task GetAllMeasurements()
  {
    var currentUserMetricId = ObjectId.GenerateNewId().ToString();
    var otherUserMetricId = ObjectId.GenerateNewId().ToString();

    for (var i = 0; i < 10; i++)
    {
      await _repository.UpsertMeasurement(
        new CounterMeasurement
        {
          MetricId = currentUserMetricId,
          UserId = _currentUserId,
          Notes = i.ToString()
        }
      );

      await _repository.UpsertMeasurement(
        new CounterMeasurement
        {
          MetricId = otherUserMetricId,
          UserId = _otherUserId,
          Notes = i.ToString()
        }
      );
    }

    IMeasurement[] otherUserMeasurements = await _userScopedRepository.GetAllMeasurements(otherUserMetricId);
    Assert.IsEmpty(otherUserMeasurements);

    IMeasurement[] currentUserMeasurements = await _userScopedRepository.GetAllMeasurements(currentUserMetricId);
    Assert.AreEqual(10, currentUserMeasurements.Length);
  }
}
