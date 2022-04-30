using System.Threading.Tasks;
using MongoDB.Driver;

namespace Metrix.Persistence.Mongo.Tests;

public static class Util
{
  public static async Task<MongoRepository> CreateMongoRepository()
  {
    var settings = new TestMongoRepositorySettings();
    var client = new MongoClient(settings.MongoDbConnectionString);
    await client.DropDatabaseAsync(settings.DatabaseName);

    return new MongoRepository(new TestMongoRepositorySettings());
  }

}
