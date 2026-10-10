using System;
using System.Threading.Tasks;
using Engraved.Core.Application;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Queries.Export;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Queries.Export;

public class ExportDataQueryExecutorShould
{
  private const string UserId = TestIds.UserId;

  private TestUserRestrictedMongoRepository _repo = null!;
  private MemoryCache _memoryCache = null!;

  [SetUp]
  public async Task SetUp()
  {
    _memoryCache = new MemoryCache(new MemoryCacheOptions());

    TestMongoRepository repo = await Util.CreateMongoRepository();
    await repo.UpsertUser(new User { Id = UserId, Name = UserId });
    await repo.UpdateScratchpad(
      UserId,
      new UserScratchpad { Content = "some notes", EditedOn = DateTime.UtcNow },
      null
    );

    _repo = await Util.CreateUserRestrictedMongoRepository(UserId, UserId, true);
  }

  [TearDown]
  public void TearDown()
  {
    _memoryCache.Dispose();
  }

  [Test]
  public async Task Include_Scratchpad()
  {
    var dispatcher = new Dispatcher(
      NullLogger<Dispatcher>.Instance,
      new TestServiceProvider(_repo),
      _repo.CurrentUser,
      new QueryCache(NullLogger<QueryCache>.Instance, _memoryCache, _repo.CurrentUser)
    );

    ExportedDataResult result = await new ExportDataQueryExecutor(dispatcher).Execute(new ExportDataQuery());

    result.Scratchpad!.Content.Should().Be("some notes");
  }
}
