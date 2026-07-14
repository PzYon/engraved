using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Schedules;
using Engraved.Core.Domain.Users;

namespace Engraved.TestUtils;

public class EngravedTestContext
{
  private EngravedTestContext() { }
  public string UserId { get; set; } = null!;
  public string UserName { get; set; } = null!;
  public TestUserRestrictedMongoRepository UserRestrictedRepo { get; set; } = null!;

  public static async Task<EngravedTestContext> CreateForUser(
    TestMongoRepository mongoRepository,
    string userName
  )
  {
    var ctx = new EngravedTestContext
    {
      UserName = userName,
      UserId = (await mongoRepository.UpsertUser(new User { Name = userName })).EntityId
    };

    ctx.UserRestrictedRepo = await Util.CreateUserRestrictedMongoRepository(userName, ctx.UserId, true);

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

    UpsertResult result = await UserRestrictedRepo.UpsertJournal(journal);
    return result.EntityId;
  }

  public async Task<string> AddEntry(string journalId, DateTime? nextOccurrence = null)
  {
    var entry = new CounterEntry { ParentId = journalId };

    if (nextOccurrence != null)
    {
      entry.Schedules[UserName] = new Schedule { NextOccurrence = nextOccurrence };
    }

    UpsertResult result = await UserRestrictedRepo.UpsertEntry(entry);
    return result.EntityId;
  }
}
