using Engraved.Core.Application.Persistence;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using Engraved.Persistence.Mongo.Scoping;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

// Full persistence access with no permission/user scoping (UnrestrictedReadScope), plus the
// inherently-unrestricted maintenance operations (keep-alive, global counts).
public class UnrestrictedMongoRepository(MongoDatabaseClient mongoDatabaseClient)
  : MongoRepositoryBase(mongoDatabaseClient, UnrestrictedReadScope.Instance), IUnrestrictedRepository
{
  private const string RandomDocId = "63f949da880b5bf2518be721";

  public async Task WakeMeUp()
  {
    await UsersCollection.FindAsync(MongoUtil.GetDocumentByIdFilter<UserDocument>(RandomDocId));
  }

  public async Task<long> CountAllUsers()
  {
    return await UsersCollection.CountDocumentsAsync(
      Builders<UserDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }

  public async Task<long> CountAllEntries()
  {
    return await EntriesCollection.CountDocumentsAsync(
      Builders<EntryDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }

  public async Task<long> CountAllJournals()
  {
    return await JournalsCollection.CountDocumentsAsync(
      Builders<JournalDocument>.Filter.Empty,
      new CountOptions { Hint = "_id_" }
    );
  }
}
