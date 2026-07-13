using Engraved.Persistence.Mongo;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.TestUtils;

// Exposes the raw collections alongside the repository so tests can arrange/assert directly in the
// database.
public class TestMongoRepository : UnrestrictedMongoRepository
{
  private readonly MongoDatabaseClient _mongoDatabaseClient;

  public TestMongoRepository(MongoDatabaseClient mongoDatabaseClient)
    : base(mongoDatabaseClient)
  {
    _mongoDatabaseClient = mongoDatabaseClient;
  }

  public IMongoCollection<JournalDocument> Journals => _mongoDatabaseClient.JournalsCollection;
  public IMongoCollection<EntryDocument> Entries => _mongoDatabaseClient.EntriesCollection;
  public IMongoCollection<UserDocument> Users => _mongoDatabaseClient.UsersCollection;
}
