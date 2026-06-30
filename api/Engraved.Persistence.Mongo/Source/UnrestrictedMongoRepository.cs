using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.DocumentTypes;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

// Full persistence access with no permission/user scoping, plus the inherently-unrestricted
// maintenance operations (keep-alive, global counts).
public class UnrestrictedMongoRepository(MongoDatabaseClient mongoDatabaseClient)
  : MongoRepositoryBase(mongoDatabaseClient), IUnrestrictedRepository
{
  private const string RandomDocId = "63f949da880b5bf2518be721";

  // no scoping: every journal/entry is visible regardless of the requested permission kind.
  protected override FilterDefinition<TDocument> GetAllJournalDocumentsFilter<TDocument>(PermissionKind kind)
  {
    return MongoUtil.GetAllDocumentsFilter<TDocument>();
  }

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
