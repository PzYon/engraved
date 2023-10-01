using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UserScopedMongoRepository_Permissions_Should
{
  private MongoRepository _repository = null!;
  private UserScopedMongoRepository _userScopedRepository = null!;

  private const string CurrentUserName = "me";

  private const string OtherUserName = "other";
  private string _otherUserId = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    await _repository.UpsertUser(new User { Name = CurrentUserName });
    _otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;

    _userScopedRepository = await Util.CreateUserScopedMongoRepository(CurrentUserName, true);
  }

  [Test]
  public async Task GetAllJournals_Return_OnlyMy()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });
    await _repository.UpsertJournal(new CounterJournal { Name = "thy-journal", UserId = _otherUserId });

    IJournal[] allJournals = await _userScopedRepository.GetAllJournals();

    Assert.AreEqual(1, allJournals.Length);
    Assert.AreEqual("my-journal", allJournals.First().Name);
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

    Assert.AreEqual(1, allJournals.Length);
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

    Assert.AreEqual(2, allJournals.Length);
  }

  [Test]
  public async Task GetAllJournals_Return_MyAndThy_WhenIHavePermissions()
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

    Assert.AreEqual(2, allJournals.Length);
  }

  [Test]
  public async Task GetAllMeasurements_Return_OnlyMy_WhenOtherOtherUserHasPermissions()
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

    await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = otherJournal.EntityId
      }
    );

    IMeasurement[] allMeasurements =
      await _userScopedRepository.GetAllMeasurements(otherJournal.EntityId, null, null, null);

    Assert.AreEqual(0, allMeasurements.Length);
  }

  [Test]
  public async Task GetAllMeasurements_Return_MyAndThy_WhenIHavePermissions()
  {
    await _userScopedRepository.UpsertJournal(new CounterJournal { Name = "my-journal" });

    UpsertResult otherJournal = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "thy-journal", UserId = _otherUserId
      }
    );

    await GiveMePermissions(otherJournal.EntityId, PermissionKind.Read);

    await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = otherJournal.EntityId
      }
    );

    IMeasurement[] allMeasurements =
      await _userScopedRepository.GetAllMeasurements(otherJournal.EntityId, null, null, null);

    Assert.AreEqual(1, allMeasurements.Length);
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithNoPermissionsAtAll()
  {
    string journalId = await CreateJournalForOtherUser();

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithOnlyReadPermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_NotPossible_WithNonePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await UpsertOtherMeasurementAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Update_Possible_WithWritePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Write);

    await UpsertOtherMeasurementAsMe(journalId);
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
  public async Task UpsertMeasurement_Add_NotPossible_WithNoPermissionsAtAll()
  {
    string journalId = await CreateJournalForOtherUser();

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddMeasurementAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_NotPossible_WithReadPermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Read);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddMeasurementAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_NotPossible_WithNonePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.None);

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await AddMeasurementAsMe(journalId); }
    );
  }

  [Test]
  public async Task UpsertMeasurement_Add_Possible_WithWritePermissions()
  {
    string journalId = await CreateJournalForOtherUser();
    await GiveMePermissions(journalId, PermissionKind.Write);

    await AddMeasurementAsMe(journalId);
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

  private async Task AddMeasurementAsMe(string journalId)
  {
    await _userScopedRepository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = journalId
      }
    );
  }

  private async Task UpsertOtherMeasurementAsMe(string journalId)
  {
    UpsertResult result = await _repository.UpsertMeasurement(
      new CounterMeasurement
      {
        ParentId = journalId,
        UserId = _otherUserId,
        Notes = "foo"
      }
    );

    const string newNotesValues = "bar";

    await _userScopedRepository.UpsertMeasurement(
      new CounterMeasurement
      {
        Id = result.EntityId,
        ParentId = journalId,
        Notes = newNotesValues
      }
    );

    IMeasurement measurement = (await _repository.GetMeasurement(result.EntityId))!;
    Assert.AreEqual(newNotesValues, measurement.Notes);
  }

  private async Task GiveMePermissions(string journalId, PermissionKind kind)
  {
    await _repository.ModifyJournalPermissions(
      journalId,
      new Dictionary<string, PermissionKind> { { CurrentUserName, kind } }
    );
  }
}
