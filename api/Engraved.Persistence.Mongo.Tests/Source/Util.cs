using System;
using System.Threading.Tasks;
using EphemeralMongo;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public static class Util
{
  // Storage engine used by the ephemeral mongo instance shared by the test suite.
  //
  //   InMemory (default): MongoDB Enterprise with the in-memory storage engine. Nothing is
  //     written to disk, so there is no ~280 MB temp data directory per test assembly. Downloads
  //     the Enterprise binaries once (a bit larger than Community) into the local app-data cache.
  //
  //   OnDisk: MongoDB Community with the default WiredTiger engine, persisting to a temporary
  //     data directory that is deleted on teardown.
  //
  // Change the default here, or override per run with the ENGRAVED_TEST_MONGO_ENGINE environment
  // variable ("inmemory" / "ondisk") - handy for a CI matrix without touching code.
  private const MongoStorageEngine DefaultStorageEngine = MongoStorageEngine.InMemory;

  private static readonly IMongoRunner Runner = MongoRunner.Run(BuildRunnerOptions());

  private static MongoRunnerOptions BuildRunnerOptions()
  {
    var options = new MongoRunnerOptions
    {
      Version = MongoVersion.V7,

      // note: do not pin MongoPort. Each test assembly runs in its own test-host process and
      // spins up its own mongo instance; a fixed port makes those processes collide (and share
      // data) when the whole solution is tested at once. A free port keeps the assemblies isolated.

      // the on-disk engine creates a ~280 MB data directory under the temp folder. The default
      // lifetime (12h) lets orphaned directories from crashed/killed runs pile up to many GB. Keep
      // them around only briefly; a clean run disposes the runner via StopRunner() (see the
      // assembly-level MongoRunnerTeardown), which deletes the directory immediately.
      DataDirectoryLifetime = TimeSpan.FromMinutes(30)
    };

    if (ResolveStorageEngine() == MongoStorageEngine.InMemory)
    {
      // the in-memory storage engine is only available in the Enterprise edition.
      options.Edition = MongoEdition.Enterprise;
      options.AdditionalArguments = ["--storageEngine", "inMemory"];
    }

    return options;
  }

  private static MongoStorageEngine ResolveStorageEngine()
  {
    return Environment.GetEnvironmentVariable("ENGRAVED_TEST_MONGO_ENGINE")?.Trim().ToLowerInvariant() switch
    {
      "inmemory" => MongoStorageEngine.InMemory,
      "ondisk" => MongoStorageEngine.OnDisk,
      _ => DefaultStorageEngine
    };
  }

  /// <summary>
  /// Stops the shared mongo instance and deletes any temp data directory. Invoked once per test
  /// assembly from an NUnit [OneTimeTearDown] so an on-disk data directory does not linger.
  /// </summary>
  public static void StopRunner()
  {
    Runner.Dispose();
  }

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

public enum MongoStorageEngine
{
  /// <summary>Enterprise in-memory engine - no data written to disk.</summary>
  InMemory,

  /// <summary>Community WiredTiger engine - persists to a temp data directory.</summary>
  OnDisk
}
