using System.Threading.Tasks;
using NUnit.Framework;

namespace Engraved.Core.Application.Persistence.Demo;

public class DemoDataRepositorySeederShould
{
  [Test]
  public async Task ShouldFeed()
  {
    IRealRepository repository = new InMemoryRepository();

    var seeder = new DemoDataRepositorySeeder(repository);

    await seeder.Seed();
  }
}
