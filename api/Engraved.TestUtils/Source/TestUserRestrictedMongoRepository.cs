using Engraved.Core.Application;
using Engraved.Persistence.Mongo;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.TestUtils;

public class TestUserRestrictedMongoRepository(
  MongoDatabaseClient mongoDatabaseClient,
  ICurrentUserService currentUserService
)
  : UserRestrictedMongoRepository(mongoDatabaseClient, currentUserService)
{
  public IMongoCollection<JournalDocument> Journals => JournalsCollection;
  public IMongoCollection<EntryDocument> Entries => EntriesCollection;
  public IMongoCollection<UserDocument> Users => UsersCollection;
}
