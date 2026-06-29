using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using FluentAssertions;
using MongoDB.Driver;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

// Pins the "one rule, two mechanisms" design: the in-memory rule (JournalAccessPolicy, used by the
// write guard) and its MongoDB query form (JournalAccessFilter, used for read-shaping) must agree
// across the full ownership/permission matrix - otherwise the two could silently drift apart.
public class JournalAccessFilter_Matches_JournalAccessPolicy_Should
{
  private const string MyId = "60703c3b0000000000000001";
  private const string OtherId = "60703c3b0000000000000002";

  private TestMongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task Agree_AcrossOwnershipAndPermissionMatrix()
  {
    foreach ((string description, string ownerId, PermissionKind? myGrant) in Scenarios())
    {
      string journalId = await CreateJournal(ownerId, myGrant);
      IJournal stored = (await _repository.GetJournal(journalId))!;

      foreach (PermissionKind required in new[] { PermissionKind.Read, PermissionKind.Write })
      {
        bool policyResult = JournalAccessPolicy.HasAccess(stored, MyId, required);
        bool filterResult = await MatchesFilter(journalId, required);

        filterResult.Should().Be(
          policyResult,
          "in-memory policy and Mongo filter must agree for [{0}] requiring {1}",
          description,
          required
        );
      }
    }
  }

  private static IEnumerable<(string description, string ownerId, PermissionKind? myGrant)> Scenarios()
  {
    yield return ("owner", MyId, null);
    yield return ("other user's journal, no permission for me", OtherId, null);
    yield return ("other user's journal, None for me", OtherId, PermissionKind.None);
    yield return ("other user's journal, Read for me", OtherId, PermissionKind.Read);
    yield return ("other user's journal, Write for me", OtherId, PermissionKind.Write);
  }

  private async Task<string> CreateJournal(string ownerId, PermissionKind? myGrant)
  {
    var journal = new CounterJournal { UserId = ownerId };
    if (myGrant.HasValue)
    {
      journal.Permissions[MyId] = new PermissionDefinition { Kind = myGrant.Value };
    }

    return (await _repository.UpsertJournal(journal)).EntityId;
  }

  private async Task<bool> MatchesFilter(string journalId, PermissionKind required)
  {
    FilterDefinition<JournalDocument> filter = Builders<JournalDocument>.Filter.And(
      MongoUtil.GetDocumentByIdFilter<JournalDocument>(journalId),
      JournalAccessFilter.ForUser<JournalDocument>(MyId, required)
    );

    return await _repository.Journals.Find(filter).AnyAsync();
  }
}
