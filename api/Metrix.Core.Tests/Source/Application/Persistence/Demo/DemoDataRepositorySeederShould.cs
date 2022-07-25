using System.Threading.Tasks;
using NUnit.Framework;

namespace Metrix.Core.Application.Persistence.Demo;

public class DemoDataRepositorySeederShould
{
  [Test]
  public async Task ShouldFeed()
  {
    IRepository repository = new InMemoryRepository();

    var seeder = new DemoDataRepositorySeeder(repository);

    await seeder.Seed();
  }
}
