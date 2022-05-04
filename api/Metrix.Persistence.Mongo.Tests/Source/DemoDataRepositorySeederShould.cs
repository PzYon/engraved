using System.Threading.Tasks;
using Metrix.Core.Application.Persistence;
using Metrix.Core.Application.Persistence.Demo;
using NUnit.Framework;

namespace Metrix.Persistence.Mongo.Tests;

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
