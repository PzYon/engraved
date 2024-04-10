using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Tests;

namespace Engraved.Tests.Utils;

public class EngravedTestContext
{
  public string UserId { get; set; } = null!;
  public string UserName { get; set; } = null!;

  public TestUserScopedMongoRepository UserScopedRepo { get; set; } = null!;
  public IDateService DateService { get; set; } = null!;

  private EngravedTestContext() { }

  public static async Task<EngravedTestContext> CreateForUser(
    TestMongoRepository mongoRepository,
    FakeDateService dateService,
    string userName
  )
  {
    var ctx = new EngravedTestContext();
    ctx.DateService = dateService;
    ctx.UserName = userName;
    ctx.UserId = (await mongoRepository.UpsertUser(new User { Name = userName })).EntityId;
    ctx.UserScopedRepo = await Util.CreateUserScopedMongoRepository(userName, ctx.UserId, true);

    return ctx;
  }

  public async Task<string> AddJournal(string name = "Test Journal", DateTime? nextOccurrence = null)
  {
    var journal = new CounterJournal
    {
      Name = name,
      UserId = UserId
    };

    if (nextOccurrence != null)
    {
      journal.Schedules[UserName] = new Schedule { NextOccurrence = nextOccurrence };
    }

    UpsertResult result = await UserScopedRepo.UpsertJournal(journal);
    return result.EntityId;
  }

  public async Task<string> AddEntry(string journalId, DateTime? nextOccurrence = null)
  {
    var entry = new CounterEntry { ParentId = journalId };

    if (nextOccurrence != null)
    {
      entry.Schedules[UserName] = new Schedule { NextOccurrence = nextOccurrence };
    }

    UpsertResult result = await UserScopedRepo.UpsertEntry(entry);
    return result.EntityId;
  }
}
