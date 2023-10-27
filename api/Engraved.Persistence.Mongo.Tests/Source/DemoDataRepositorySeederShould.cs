using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class DemoDataRepositorySeederShould
{
  [Test]
  public async Task ShouldFeed()
  {
    IRepository repository = await Util.CreateMongoRepository();

    var seeder = new DemoDataRepositorySeeder(repository);

    await seeder.Seed();
  }
}
