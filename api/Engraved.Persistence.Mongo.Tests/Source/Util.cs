using System.Threading.Tasks;
using EphemeralMongo;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public static class Util
{
  private static readonly IMongoRunner Runner = MongoRunner.Run();

  private static IMongoRepositorySettings Settings => new TestMongoRepositorySettings(Runner.ConnectionString);
  private static MongoDatabaseClient Client => new(Settings, null);

  public static async Task<TestMongoRepository> CreateMongoRepository()
  {
    await DropDatabase();

    return new TestMongoRepository(Client);
  }

  public static async Task<TestUserScopedMongoRepository> CreateUserScopedMongoRepository(
    string userName,
    string userId,
    bool doNotDropDatabase
  )
  {
    if (!doNotDropDatabase)
    {
      await DropDatabase();
    }

    var userService = new MockCurrentUserService(userId);
    userService.SetUserName(userName);

    return new TestUserScopedMongoRepository(Client, userService);
  }

  private static async Task DropDatabase()
  {
    var client = new MongoClient(Runner.ConnectionString);
    await client.DropDatabaseAsync(Settings.DatabaseName);
  }
}
