using System.Security.Authentication;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using Microsoft.Extensions.Logging;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo;

public class MongoDatabaseClient
{
  private readonly ILogger? _logger;

  public readonly IMongoCollection<EntryDocument> EntriesCollection;
  public readonly IMongoCollection<JournalDocument> JournalsCollection;
  public readonly IMongoCollection<UserDocument> UsersCollection;

  public MongoDatabaseClient(ILogger? logger, IMongoRepositorySettings settings, string? dbNameOverride)
  {
    _logger = logger;

    IMongoClient client = CreateMongoClient(settings);

    string dbName = string.IsNullOrEmpty(dbNameOverride) ? settings.DatabaseName : dbNameOverride;

    IMongoDatabase? db = client.GetDatabase(dbName);
    
    JournalsCollection = db.GetCollection<JournalDocument>(settings.JournalsCollectionName);
    EntriesCollection = db.GetCollection<EntryDocument>(settings.EntriesCollectionName);
    UsersCollection = db.GetCollection<UserDocument>(settings.UsersCollectionName);
  }

  static MongoDatabaseClient()
  {
    // below stuff is required for polymorphic document types to work. it would
    // somehow be nicer if this handled by every document-class itself, but that
    // doesn't work for whatever reasons.
    BsonClassMap.RegisterClassMap<CounterEntryDocument>();
    BsonClassMap.RegisterClassMap<TimerEntryDocument>();
    BsonClassMap.RegisterClassMap<GaugeEntryDocument>();
    BsonClassMap.RegisterClassMap<ScrapsEntryDocument>();
    BsonClassMap.RegisterClassMap<CounterJournalDocument>();
    BsonClassMap.RegisterClassMap<TimerJournalDocument>();
    BsonClassMap.RegisterClassMap<GaugeJournalDocument>();
    BsonClassMap.RegisterClassMap<ScrapsJournalDocument>();
  }

  private IMongoClient CreateMongoClient(IMongoRepositorySettings settings)
  {
    MongoClientSettings? clientSettings = MongoClientSettings.FromUrl(new MongoUrl(settings.MongoDbConnectionString));
    clientSettings.SslSettings = new SslSettings { EnabledSslProtocols = SslProtocols.Tls12 };

    // void LogDuration(TimeSpan duration, string commandName)
    // {
    //  _logger?.LogInformation($"[MongoDb] - {commandName}-duration: {duration.TotalMilliseconds}ms");
    // }
    //
    // clientSettings.ClusterConfigurator = clusterBuilder =>
    // {
    //   clusterBuilder.Subscribe<CommandSucceededEvent>(e => LogDuration(e.Duration, e.CommandName));
    //   clusterBuilder.Subscribe<CommandFailedEvent>(e => LogDuration(e.Duration, e.CommandName));
    // };

    return new MongoClient(clientSettings);
  }

}
