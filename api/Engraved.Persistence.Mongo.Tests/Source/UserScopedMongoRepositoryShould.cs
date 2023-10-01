using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using MongoDB.Driver;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UserScopedMongoRepositoryShould
{
  private TestMongoRepository _repository = null!;
  private TestUserScopedMongoRepository _userScopedRepository = null!;

  private const string CurrentUserName = "me";
  private string _currentUserId = null!;

  private const string OtherUserName = "other";
  private string _otherUserId = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    _currentUserId = (await _repository.UpsertUser(new User { Name = CurrentUserName })).EntityId;
    _otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;

    _userScopedRepository = await Util.CreateUserScopedMongoRepository(CurrentUserName, true);
  }

  [Test]
  public async Task GetUser_Returns_CurrentUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userScopedRepository.GetUser(CurrentUserName);

    Assert.IsNotNull(user);
    Assert.AreEqual(CurrentUserName, user!.Name);
  }

  [Test]
  public async Task GetUser_DoesReturn_OtherUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userScopedRepository.GetUser(OtherUserName);

    Assert.IsNotNull(user);
  }

  [Test]
  public async Task GetUsers_Returns_RequestedUsers()
  {
    UpsertResult result1 = await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });
    UpsertResult result3 = await _repository.UpsertUser(new User { Name = "gusti" });

    IUser[] users = await _userScopedRepository.GetUsers(result1.EntityId, result3.EntityId);

    Assert.AreEqual(2, users.Length);
  }

  [Test]
  public async Task UpsertUser_ShouldUpdate_CurrentUser()
  {
    IUser? current = await _repository.GetUser(CurrentUserName);
    Assert.IsNotNull(current);

    UpsertResult result = await _userScopedRepository.UpsertUser(current!);

    Assert.AreEqual(_userScopedRepository.CurrentUser.Value.Id, result.EntityId);
  }

  [Test]
  public void UpsertUser_ShouldThrow_WhenUpdating_OtherUser()
  {
    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => await _userScopedRepository.UpsertUser(
        new User { Id = _otherUserId, Name = OtherUserName }
      )
    );
  }

  [Test]
  public async Task UpsertJournal_Ensures_CurrentUser_Id()
  {
    IJournal journal = new TimerJournal();

    UpsertResult result = await _userScopedRepository.UpsertJournal(journal);
    IJournal? createdJournal = await _repository.GetJournal(result.EntityId);

    Assert.AreEqual(result.EntityId, createdJournal!.Id);
    Assert.AreEqual(_currentUserId, createdJournal.UserId);
  }

  [Test]
  public async Task UpsertJournal_ThrowsWhen_EntityFromOtherUser()
  {
    UpsertResult result = await _repository.UpsertJournal(new TimerJournal { UserId = _otherUserId });

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () =>
      {
        await _userScopedRepository.UpsertJournal(
          new TimerJournal
          {
            Id = result.EntityId,
            Notes = "Random"
          }
        );
      }
    );
  }

  [Test]
  public async Task UpsertEntry_Ensures_CurrentUser_Id()
  {
    UpsertResult upsertJournal = await _userScopedRepository.UpsertJournal(new TimerJournal());
    string journalId = upsertJournal.EntityId;

    IEntry entry = new TimerEntry { ParentId = journalId };

    await _userScopedRepository.UpsertEntry(entry);
    IEntry[] entries = await _repository.GetAllEntries(journalId, null, null, null);

    Assert.True(entries.All(m => m.UserId == _currentUserId));
  }

  [Test]
  public void UpsertEntry_ThrowsWhen_EntityFromOtherUser()
  {
    IEntry entry = new TimerEntry
    {
      ParentId = MongoUtil.GenerateNewIdAsString(),
      UserId = _otherUserId
    };

    Assert.ThrowsAsync<NotAllowedOperationException>(
      async () => { await _userScopedRepository.UpsertEntry(entry); }
    );
  }

  [Test]
  public async Task GetJournal_ShouldLoadFrom_CurrentUser()
  {
    UpsertResult currentUserResult = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Current User",
        UserId = _currentUserId
      }
    );

    await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Other User",
        UserId = _otherUserId
      }
    );

    IJournal? journal = await _userScopedRepository.GetJournal(currentUserResult.EntityId);
    Assert.IsNotNull(journal);
    Assert.AreEqual(journal!.Name, "From Current User");
  }

  [Test]
  public async Task GetJournal_ShouldReturnNull_WhenLoadingFrom_OtherUser()
  {
    await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Current User",
        UserId = _currentUserId
      }
    );

    UpsertResult otherUserResult = await _repository.UpsertJournal(
      new CounterJournal
      {
        Name = "From Other User",
        UserId = _otherUserId
      }
    );

    IJournal? journal = await _userScopedRepository.GetJournal(otherUserResult.EntityId);
    Assert.IsNull(journal);
  }

  [Test]
  public async Task GetAllEntries()
  {
    UpsertResult currentUserJournalResult =
      await _repository.UpsertJournal(new CounterJournal { UserId = _currentUserId });

    string currentUserJournalId = currentUserJournalResult.EntityId;

    UpsertResult otherUserJournalResult
      = await _repository.UpsertJournal(new CounterJournal { UserId = _otherUserId });

    string otherUserJournalId = otherUserJournalResult.EntityId;

    for (var i = 0; i < 10; i++)
    {
      await _repository.UpsertEntry(
        new CounterEntry
        {
          ParentId = currentUserJournalId,
          UserId = _currentUserId,
          Notes = i.ToString()
        }
      );

      await _repository.UpsertEntry(
        new CounterEntry
        {
          ParentId = otherUserJournalId,
          UserId = _otherUserId,
          Notes = i.ToString()
        }
      );
    }

    IEntry[] otherUserEntries = await _userScopedRepository.GetAllEntries(otherUserJournalId, null, null, null);

    Assert.IsEmpty(otherUserEntries);

    IEntry[] currentUserEntries = await _userScopedRepository.GetAllEntries(currentUserJournalId, null, null, null);

    Assert.AreEqual(10, currentUserEntries.Length);
  }

  [Test]
  public async Task DeleteEntry()
  {
    UpsertResult result = await _repository.UpsertEntry(
      new CounterEntry
      {
        UserId = _currentUserId,
        Notes = "WillBeDeleted"
      }
    );

    IEntry? entry = await _repository.GetEntry(result.EntityId);
    Assert.IsNotNull(entry);

    await _userScopedRepository.DeleteEntry(result.EntityId);

    entry = await _repository.GetEntry(result.EntityId);
    Assert.IsNull(entry);
  }

  [Test]
  public async Task DeleteEntry_ShouldNotDelete_FromOtherUser()
  {
    UpsertResult result = await _repository.UpsertEntry(
      new CounterEntry
      {
        UserId = _otherUserId,
        Notes = "WillBeDeleted"
      }
    );

    IEntry? entry = await _repository.GetEntry(result.EntityId);
    Assert.IsNotNull(entry);

    await _userScopedRepository.DeleteEntry(result.EntityId);
    Assert.IsNotNull(entry);
  }

  [Test]
  public async Task DeleteJournal_AndItsEntries()
  {
    UpsertResult journal = await _repository.UpsertJournal(
      new CounterJournal
      {
        UserId = _currentUserId
      }
    );

    await _repository.UpsertEntry(
      new CounterEntry
      {
        ParentId = journal.EntityId,
        UserId = _currentUserId
      }
    );

    Assert.AreEqual(1, await _repository.Journals.CountDocumentsAsync(FilterDefinition<JournalDocument>.Empty));
    Assert.AreEqual(
      1,
      await _repository.Entries.CountDocumentsAsync(FilterDefinition<EntryDocument>.Empty)
    );

    await _repository.DeleteJournal(journal.EntityId);

    Assert.AreEqual(0, (await _repository.GetAllJournals()).Length);

    Assert.AreEqual(0, await _repository.Journals.CountDocumentsAsync(FilterDefinition<JournalDocument>.Empty));
    Assert.AreEqual(
      0,
      await _repository.Entries.CountDocumentsAsync(FilterDefinition<EntryDocument>.Empty)
    );
  }
}
