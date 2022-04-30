using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;
using MongoDB.Driver;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

public class DemoDataRepositorySeederShould
{
  [Test]
  public async Task ShouldFeed()
  {
    /*
     *
     * Copied!!
     * 
     */
    
    var settings = new TestMongoRepositorySettings();
    var client = new MongoClient(settings.MongoDbConnectionString);
    client.DropDatabase(settings.DatabaseName);

    IRepository repository = new MongoRepository(new TestMongoRepositorySettings());
    
    DemoDataRepositorySeeder seeder = new DemoDataRepositorySeeder(repository);

    await seeder.Seed();
  }
}
