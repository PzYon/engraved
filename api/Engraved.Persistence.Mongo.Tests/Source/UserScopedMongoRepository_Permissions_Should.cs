using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UserScopedMongoRepository_Permissions_Should
{
  private const string CurrentUserName = "me";

  private const string OtherUserName = "other";
  private string _otherUserId = null!;
  private UnrestrictedMongoRepository _repository = null!;
  private UserRestrictedMongoRepository _userScopedRepository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    UpsertResult upsertResult = await _repository.UpsertUser(new User { Name = CurrentUserName });
    _otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;
    _userScopedRepository = await Util.CreateUserScopedMongoRepository(CurrentUserName, upsertResult.EntityId, true);
  }

  [Test]
  public async Task GetAllJournals_Return_OnlyMy()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });
    await _repository.UpsertJournal(new CounterJournal { Name = "thy-journal", UserId = _otherUserId });

    IJournal[] allJournals = await _userScopedRepository.GetAllJournals();

    allJournals.Length.Should().Be(1);
    allJournals.First().Name.Should().Be("my-journal");
  }

  [Test]
  public async Task GetAllJournals_Return_OnlyMy_WhenOtherOtherUserHasPermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });

    UpsertResult otherJournal = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-journal", UserId = _otherUserId
      }
    );

    await _repository.ModifyJournalPermissions(
      otherJournal.EntityId,
      new Dictionary<string, PermissionKind> { { OtherUserName + "_another_one", PermissionKind.Write } }
    );

    IJournal[] allJournals = await _userScopedRepository.GetAllJournals();

    allJournals.Length.Should().Be(1);
  }

  [Test]
  public async Task GetAllJournals_Return_MyAndThy_WhenIMoreThanEnoughHavePermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });

    UpsertResult otherJournal = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-journal", UserId = _otherUserId
      }
    );

    await GiveMePermissions(otherJournal.EntityId, PermissionKind.Write);

    IJournal[] allJournals = await _userScopedRepository.GetAllJournals();

    allJournals.Length.Should().Be(2);
  }

  [Test]
  public async Task GetEntriesForJournal_Return_MyAndThy_WhenIHavePermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });

    UpsertResult otherJournal = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-journal", UserId = _otherUserId
      }
    );

    await GiveMePermissions(otherJournal.EntityId, PermissionKind.Read);

    IJournal[] allJournals = await _userScopedRepository.GetAllJournals();

    allJournals.Length.Should().Be(2);
  }

  [Test]
  public async Task GetEntriesForJournal_Return_OnlyMy_WhenOtherOtherUserHasPermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });

    UpsertResult otherJournal = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-journal", UserId = _otherUserId
      }
    );

    await _repository.ModifyJournalPermissions(
      otherJournal.EntityId,
      new Dictionary<string, PermissionKind> { { OtherUserName + "_another_one", PermissionKind.Write } }
    );

    await _repository.UpsertEntry(
      new CounterEntry
      {
        ParentId = otherJournal.EntityId
      }
    );

    IEntry[] allEntries = await _userScopedRepository.GetEntriesForJournal(otherJournal.EntityId);

    allEntries.Should().BeEmpty();
  }

  [Test]
  public async Task GetAllEntries_Return_MyAndThy_WhenIHavePermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });

    UpsertResult otherJournal = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-journal", UserId = _otherUserId
      }
    );

    await GiveMePermissions(otherJournal.EntityId, PermissionKind.Read);

    await _repository.UpsertEntry(
      new CounterEntry
      {
        ParentId = otherJournal.EntityId
      }
    );

    IEntry[] allEntries = await _userScopedRepository.GetEntriesForJournal(otherJournal.EntityId);

    allEntries.Length.Should().Be(1);
  }

  [Test]
  public async Task UpsertEntry_Update_NotPossible_WithNoPermissionsAtAll()
  {
    string journalId = await CreateJournalForOtherUser();

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherEntryAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertEntry_Update_NotPossible_WithOnlyReadPermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherEntryAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertEntry_Update_NotPossible_WithNonePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherEntryAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertEntry_Update_Possible_WithWritePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Write);

    await UpsertOtherEntryAsMe(journalId);
  }

  [Test]
  public async Task UpsertJournal_Update_NotPossible_WithNoPermissionsAtAll()
  {
    string journalId = await CreateJournalForOtherUser();

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertJournalAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertJournal_Update_NotPossible_WithReadPermissions()
  {
    string journalId = await CreateJournalForOtherUser();

    await GiveMePermissions(journalId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertJournalAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertJournal_Update_NotPossible_WithNonePermissions()
  {
    string journalId = await CreateJournalForOtherUser();

    await GiveMePermissions(journalId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertJournalAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertJournal_Update_Possible_WithWritePermissions()
  {
    string journalId = await CreateJournalForOtherUser();

    await GiveMePermissions(journalId, PermissionKind.Write);

    await UpsertJournalAsMe(journalId);
  }

  [Test]
  public async Task UpsertEntry_Add_NotPossible_WithNoPermissionsAtAll()
  {
    string journalId = await CreateJournalForOtherUser();

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddEntryAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertEntry_Add_NotPossible_WithReadPermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddEntryAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertEntry_Add_NotPossible_WithNonePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddEntryAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertEntry_Add_Possible_WithWritePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Write);

    await AddEntryAsMe(journalId);
  }

  [Test]
  public void UpsertEntry_WithoutParentJournal_IsRejected_FailClosed()
  {
    // The write guard is fail-closed: an entry with no parent journal id has no journal to authorize
    // against, so the write is rejected rather than silently allowed (which would create an orphan
    // entry). Pins the intentional behavior of EnsureUserHasPermission for a missing journal id.
    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await _userScopedRepository.UpsertEntry(new CounterEntry()); }
    );
  }

  [Test]
  public async Task DeleteEntry_NotPossible_WithNoPermissionsAtAll()
  {
    string journalId = await CreateJournalForOtherUser();
    string entryId = await AddEntryForOtherUser(journalId);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await _userScopedRepository.DeleteEntry(entryId); }
    );

    (await _repository.GetEntry(entryId)).Should().NotBeNull();
  }

  [Test]
  public async Task DeleteEntry_NotPossible_WithOnlyReadPermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Read);
    string entryId = await AddEntryForOtherUser(journalId);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await _userScopedRepository.DeleteEntry(entryId); }
    );

    (await _repository.GetEntry(entryId)).Should().NotBeNull();
  }

  [Test]
  public async Task DeleteEntry_Possible_WithWritePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Write);
    string entryId = await AddEntryForOtherUser(journalId);

    await _userScopedRepository.DeleteEntry(entryId);

    (await _repository.GetEntry(entryId)).Should().BeNull();
  }

  [Test]
  public async Task GetEntry_IsUnscoped_ReturnsEntry_EvenWithoutJournalPermission()
  {
    // GetEntry is intentionally an unscoped primitive: it does NOT enforce read permission on the
    // parent journal. Read enforcement for the client-facing single-entry endpoint lives in
    // GetEntryQueryExecutor (which re-checks via the scoped GetJournal), while write paths enforce
    // at upsert/delete time. This test pins that contract so moving scoping into the repository
    // becomes a conscious, test-breaking decision rather than an accidental behavioral change.
    string journalId = await CreateJournalForOtherUser();
    string entryId = await AddEntryForOtherUser(journalId);

    IEntry? entry = await _userScopedRepository.GetEntry(entryId);

    entry.Should().NotBeNull();
  }

  [Test]
  public async Task SearchEntries_IsUnscoped_TrustsCallerProvidedJournalIds()
  {
    // SearchEntries does not enforce journal read-permission; it trusts the journalIds passed by the
    // caller. SearchEntriesQueryExecutor is responsible for passing only the current user's
    // accessible journals (obtained via the scoped GetAllJournals). Pinned here so the "unsecured"
    // contract is explicit rather than accidental.
    string journalId = await CreateJournalForOtherUser();
    await AddEntryForOtherUser(journalId);

    IEntry[] entries = await _userScopedRepository.SearchEntries(null, null, null, [journalId]);

    entries.Should().HaveCount(1);
  }

  private async Task<string> AddEntryForOtherUser(string journalId)
  {
    UpsertResult result = await _repository.UpsertEntry(
      new CounterEntry
      {
        ParentId = journalId,
        UserId = _otherUserId
      }
    );

    return result.EntityId;
  }

  private async Task UpsertJournalAsMe(string journalId)
  {
    await _userScopedRepository.UpsertJournal(
      new CounterJournal { Id = journalId }
    );
  }

  private async Task<string> CreateJournalForOtherUser()
  {
    UpsertResult upsertResult = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-journal", UserId = _otherUserId
      }
    );

    return upsertResult.EntityId;
  }

  private async Task AddEntryAsMe(string journalId)
  {
    await _userScopedRepository.UpsertEntry(
      new CounterEntry
      {
        ParentId = journalId
      }
    );
  }

  private async Task UpsertOtherEntryAsMe(string journalId)
  {
    UpsertResult result = await _repository.UpsertEntry(
      new CounterEntry
      {
        ParentId = journalId,
        UserId = _otherUserId,
        Notes = "foo"
      }
    );

    const string newNotesValues = "bar";

    await _userScopedRepository.UpsertEntry(
      new CounterEntry
      {
        Id = result.EntityId,
        ParentId = journalId,
        Notes = newNotesValues
      }
    );

    IEntry entry = (await _repository.GetEntry(result.EntityId))!;
    newNotesValues.Should().Be(entry.Notes);
  }

  private async Task GiveMePermissions(string journalId, PermissionKind kind)
  {
    await _repository.ModifyJournalPermissions(
      journalId,
      new Dictionary<string, PermissionKind> { { CurrentUserName, kind } }
    );
  }
}
