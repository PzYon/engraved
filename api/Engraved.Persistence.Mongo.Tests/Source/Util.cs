using System.Threading.Tasks;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public static class Util
{
  private static IMongoRepositorySettings Settings => new TestMongoRepositorySettings();
  private static MongoDatabaseClient Client => new(null, new TestMongoRepositorySettings(), null);

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
    var client = new MongoClient(Settings.MongoDbConnectionString);
    await client.DropDatabaseAsync(Settings.DatabaseName);
  }
}
