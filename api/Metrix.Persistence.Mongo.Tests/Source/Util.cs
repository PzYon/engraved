using System.Threading.Tasks;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo.Tests;

public static class Util
{
  private static TestMongoRepositorySettings Settings => new();

  public static async Task<MongoRepository> CreateMongoRepository()
  {
    await DropDatabase();

    return new MongoRepository(Settings);
  }

  public static async Task<UserScopedMongoRepository> CreateUserScopedMongoRepository(
    string userName,
    bool doNotDropDatabase
    )
  {
    if (!doNotDropDatabase)
    {
      await DropDatabase();
    }

    var userService = new MockCurrentUserService();
    userService.SetUserName(userName);

    return new UserScopedMongoRepository(Settings, userService);
  }

  private static async Task DropDatabase()
  {
    var client = new MongoClient(Settings.MongoDbConnectionString);
    await client.DropDatabaseAsync(Settings.DatabaseName);
  }
}
