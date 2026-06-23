using System.Security.Authentication;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public class MongoDatabaseClient
{
  public readonly IMongoCollection<EntryDocument> EntriesCollection;
  public readonly IMongoCollection<JournalDocument> JournalsCollection;
  public readonly IMongoCollection<UserDocument> UsersCollection;

  static MongoDatabaseClient()
  {
    // below stuff is required for polymorphic document types to work. it would
    // somehow be nicer if this handled by every document-class itself, but that
    // doesn't work for whatever reason.
    BsonClassMap.RegisterClassMap<CounterEntryDocument>();
    BsonClassMap.RegisterClassMap<TimerEntryDocument>();
    BsonClassMap.RegisterClassMap<GaugeEntryDocument>();
    BsonClassMap.RegisterClassMap<ScrapsEntryDocument>();
    BsonClassMap.RegisterClassMap<LogBookEntryDocument>();
    BsonClassMap.RegisterClassMap<CounterJournalDocument>();
    BsonClassMap.RegisterClassMap<TimerJournalDocument>();
    BsonClassMap.RegisterClassMap<GaugeJournalDocument>();
    BsonClassMap.RegisterClassMap<ScrapsJournalDocument>();
    BsonClassMap.RegisterClassMap<LogBookJournalDocument>();

    BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.CSharpLegacy));
  }

  public MongoDatabaseClient(IMongoRepositorySettings settings, string? dbNameOverride)
  {
    IMongoClient client = CreateMongoClient(settings);

    var dbName = string.IsNullOrEmpty(dbNameOverride) ? settings.DatabaseName : dbNameOverride;

    IMongoDatabase? db = client.GetDatabase(dbName);

    JournalsCollection = db.GetCollection<JournalDocument>(settings.JournalsCollectionName);
    EntriesCollection = db.GetCollection<EntryDocument>(settings.EntriesCollectionName);
    UsersCollection = db.GetCollection<UserDocument>(settings.UsersCollectionName);
  }

  private static IMongoClient CreateMongoClient(IMongoRepositorySettings settings)
  {
    MongoClientSettings? clientSettings = MongoClientSettings.FromUrl(new MongoUrl(settings.MongoDbConnectionString));
    clientSettings.SslSettings = new SslSettings { EnabledSslProtocols = SslProtocols.Tls12 };

    return new MongoClient(clientSettings);
  }
}
