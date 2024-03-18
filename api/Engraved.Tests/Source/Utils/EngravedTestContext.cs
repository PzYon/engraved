using Engraved.Core.Application;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.Tests;

namespace Engraved.Tests.Utils;

public class EngravedTestContext
{
  public string UserId { get; set; } = null!;
  public string UserName { get; set; } = null!;

  public TestMongoRepository Repo { get; set; } = null!;
  public TestUserScopedMongoRepository UserScopedRepo { get; set; } = null!;
  public IDateService DateService { get; set; } = null!;

  private EngravedTestContext() { }

  public static async Task<EngravedTestContext> CreateForUser(FakeDateService dateService, string userName)
  {
    var ctx = new EngravedTestContext();
    ctx.DateService = dateService;
    ctx.Repo = await Util.CreateMongoRepository();
    ctx.UserName = userName;
    ctx.UserId = (await ctx.Repo.UpsertUser(new User { Name = userName })).EntityId;
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
    
    UpsertResult upsertJournal = await UserScopedRepo.UpsertJournal(journal);
    
    return upsertJournal.EntityId;
  }
}
