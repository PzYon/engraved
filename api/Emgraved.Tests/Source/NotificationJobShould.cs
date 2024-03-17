using Engraved.Core.Application;
using Engraved.Core.Application.Jobs;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.Tests;
using Microsoft.Extensions.Logging.Abstractions;

namespace Emgraved.Tests;

public class NotificationJobShould
{
  private const string UserName = "boss";

  private string _currentUserId = null!;
  private TestMongoRepository _repository = null!;
  private TestUserScopedMongoRepository _userScopedRepository = null!;
  private NotificationJob _job;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    _currentUserId = (await _repository.UpsertUser(new User { Name = UserName })).EntityId;
    _userScopedRepository = await Util.CreateUserScopedMongoRepository(UserName, _currentUserId, false);

    _job = new NotificationJob(
      NullLogger<NotificationJob>.Instance,
      _userScopedRepository,
      new FakeDateService(),
      new TestNotificationService()
    );
  }

  [Test]
  public async Task Test1()
  {
    await _job.Execute(false);
  }
}
