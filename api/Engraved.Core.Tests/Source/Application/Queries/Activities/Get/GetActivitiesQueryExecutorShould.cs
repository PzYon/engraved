using Engraved.Core.Application.Persistence.Demo;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Activities.Get;

public class GetActivitiesQueryExecutorShould
{
  private InMemoryRepository _repo = null!;

  [SetUp]
  public void SetUp()
  {
    _repo = new InMemoryRepository();
  }

  [Test]
  public void Foo()
  {

  }
}
