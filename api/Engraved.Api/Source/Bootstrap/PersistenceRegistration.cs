using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Permissions;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo;
using Engraved.Persistence.Mongo.Repositories;
using Engraved.Persistence.Mongo.Scoping;

namespace Engraved.Api.Bootstrap;

public static class PersistenceRegistration
{
  public static void RegisterPersistence(IServiceCollection services, IConfiguration configuration, bool isE2ETests)
  {
    // it is recommended to only have one instance of the MongoClient:
    // https://mongodb.github.io/mongo-csharp-driver/2.14/reference/driver/connecting/#re-use
    // we did not have this at first and it actually had a bad influence
    // on performance.
    services.AddSingleton(_ => new MongoDatabaseClient(
        CreateRepositorySettings(configuration, isE2ETests),
        GetMongoDbNameOverride(isE2ETests)
      )
    );

    RegisterUserRestrictedRepository(services);

    RegisterUnrestrictedRepository(services);
  }

  private static void RegisterUserRestrictedRepository(IServiceCollection services)
  {
    // Scoped so the current user is loaded from the database at most once per request: the same
    // Lazy<IUser> instance is shared by the read scope, the write guards and every consumer
    // (executors, Dispatcher, QueryCache, controllers).
    services.AddScoped<Lazy<IUser>>(provider => CurrentUserLoader.CreateCurrentUserLazy(
        provider.GetRequiredService<MongoDatabaseClient>(),
        provider.GetRequiredService<ICurrentUserService>()
      )
    );

    // The role-based persistence interfaces resolve to the user-restricted decorators (reads shaped
    // by UserReadScope, writes guarded by JournalWriteGuard), so executors that depend on just the
    // role(s) they use transparently get permission enforcement. Consumers that need unrestricted
    // access inject IUnrestrictedRepository (above) instead.
    services.AddTransient<IUserRepository>(provider => new UserRestrictedUserRepository(
        new MongoUserRepository(GetMongoDatabaseClient(provider)),
        CreateWriteGuard(provider)
      )
    );

    services.AddTransient<IJournalRepository>(provider => new UserRestrictedJournalRepository(
        CreateUserScopedJournalRepository(provider),
        CreateWriteGuard(provider)
      )
    );

    services.AddTransient<IEntryRepository>(provider => new UserRestrictedEntryRepository(
        new MongoEntryRepository(GetMongoDatabaseClient(provider), CreateUserScopedJournalRepository(provider)),
        CreateWriteGuard(provider)
      )
    );

    // PermissionsEnsurer deliberately works on the plain (unguarded) user repository: granting a
    // permission may create the receiving user's record, which the ownership guard on the
    // user-restricted UpsertUser would (rightly) reject. Write access to the journal itself is
    // enforced by its consumer (EditJournalPermissionsCommandExecutor).
    services.AddTransient<PermissionsEnsurer>(provider =>
      {
        var userRepository = new MongoUserRepository(provider.GetRequiredService<MongoDatabaseClient>());
        return new PermissionsEnsurer(userRepository, userRepository.UpsertUser);
      }
    );
  }

  private static void RegisterUnrestrictedRepository(IServiceCollection services)
  {
    services.AddTransient<IUnrestrictedRepository>(provider =>
      {
        var mongoDbClient = provider.GetRequiredService<MongoDatabaseClient>();
        return new UnrestrictedMongoRepository(mongoDbClient);
      }
    );

    services.AddTransient<IMaintenanceRepository>(provider => provider.GetRequiredService<IUnrestrictedRepository>());
  }

  private static MongoJournalRepository CreateUserScopedJournalRepository(IServiceProvider provider)
  {
    return new MongoJournalRepository(
      GetMongoDatabaseClient(provider),
      new UserReadScope(provider.GetRequiredService<Lazy<IUser>>())
    );
  }

  private static JournalWriteGuard CreateWriteGuard(IServiceProvider provider)
  {
    return new JournalWriteGuard(
      CreateUserScopedJournalRepository(provider),
      provider.GetRequiredService<Lazy<IUser>>()
    );
  }

  private static MongoDatabaseClient GetMongoDatabaseClient(IServiceProvider provider)
  {
    return provider.GetRequiredService<MongoDatabaseClient>();
  }

  private static string? GetMongoDbNameOverride(bool isE2ETests)
  {
    return isE2ETests ? "engraved_e2e_tests" : null;
  }

  private static MongoRepositorySettings CreateRepositorySettings(IConfiguration configuration, bool isE2ETests)
  {
    var connectionString = configuration.GetConnectionString("engraved_db");
    if (string.IsNullOrEmpty(connectionString) && !isE2ETests)
    {
      throw new InvalidOperationException("App Service Config: No connection string available.");
    }

    return new MongoRepositorySettings(connectionString ?? "mongodb://localhost:27017");
  }
}
