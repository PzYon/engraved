using System;
using System.Threading.Tasks;
using EphemeralMongo;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public static class Util
{
  private static readonly IMongoRunner Runner = MongoRunner.Run(
    new MongoRunnerOptions
    {
      Version = MongoVersion.V7,

      // note: do not pin MongoPort. Each test assembly runs in its own test-host process and
      // spins up its own mongo instance; a fixed port makes those processes collide (and share
      // data) when the whole solution is tested at once. A free port keeps the assemblies isolated.

      // each mongo instance creates a ~280 MB data directory under the temp folder. The default
      // lifetime (12h) lets orphaned directories from crashed/killed runs pile up to many GB. Keep
      // them around only briefly; a clean run disposes the runner via StopRunner() (see the
      // assembly-level MongoRunnerTeardown), which deletes the directory immediately.
      DataDirectoryLifetime = TimeSpan.FromMinutes(30)
    }
  );

  /// <summary>
  /// Stops the shared mongo instance and deletes its temp data directory. Invoked once per test
  /// assembly from an NUnit [OneTimeTearDown] so the ~280 MB data directory does not linger.
  /// </summary>
  public static void StopRunner()
  {
    Runner.Dispose();
  }

  // Exposes the ephemeral mongo connection string so other test assemblies (e.g. the Api startup
  // smoke test) can point the real application at this instance.
  public static string ConnectionString => Runner.ConnectionString;

  private static IMongoRepositorySettings Settings => new TestMongoRepositorySettings(Runner.ConnectionString);
  private static MongoDatabaseClient Client => new(Settings, null);

  public static async Task<TestMongoRepository> CreateMongoRepository()
  {
    await DropDatabase();

    return new TestMongoRepository(Client);
  }

  public static async Task<TestUserRestrictedMongoRepository> CreateUserRestrictedMongoRepository(
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

    return new TestUserRestrictedMongoRepository(Client, userService);
  }

  private static async Task DropDatabase()
  {
    var client = new MongoClient(Runner.ConnectionString);
    await client.DropDatabaseAsync(Settings.DatabaseName);
  }
}
