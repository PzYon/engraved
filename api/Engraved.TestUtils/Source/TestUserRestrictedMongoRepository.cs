using Engraved.Core.Application;
using Engraved.Persistence.Mongo;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.TestUtils;

// Exposes the raw collections alongside the repository so tests can arrange/assert directly in the
// database.
public class TestUserRestrictedMongoRepository : UserRestrictedMongoRepository
{
  private readonly MongoDatabaseClient _mongoDatabaseClient;

  public TestUserRestrictedMongoRepository(
    MongoDatabaseClient mongoDatabaseClient,
    ICurrentUserService currentUserService
  )
    : base(mongoDatabaseClient, currentUserService)
  {
    _mongoDatabaseClient = mongoDatabaseClient;
  }

  public IMongoCollection<JournalDocument> Journals => _mongoDatabaseClient.JournalsCollection;
  public IMongoCollection<EntryDocument> Entries => _mongoDatabaseClient.EntriesCollection;
  public IMongoCollection<UserDocument> Users => _mongoDatabaseClient.UsersCollection;
}
