using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using FluentAssertions;
using MongoDB.Driver;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class UserRestrictedMongoRepositoryShould
{
  private const string CurrentUserName = "me";
  private const string OtherUserName = "other";
  private string _currentUserId = null!;
  private string _otherUserId = null!;

  private TestMongoRepository _repository = null!;
  private TestUserRestrictedMongoRepository _userRestrictedRepository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    _currentUserId = (await _repository.UpsertUser(new User { Name = CurrentUserName })).EntityId;
    _otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;

    _userRestrictedRepository = await Util.CreateUserRestrictedMongoRepository(CurrentUserName, _currentUserId, true);
  }

  [Test]
  public async Task GetUser_Returns_CurrentUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userRestrictedRepository.GetUser(CurrentUserName);

    user.Should().NotBeNull();
    user.Name.Should().Be(CurrentUserName);
  }

  [Test]
  public async Task GetUser_DoesReturn_OtherUser()
  {
    await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });

    IUser? user = await _userRestrictedRepository.GetUser(OtherUserName);

    user.Should().NotBeNull();
  }

  [Test]
  public async Task GetUsers_Returns_RequestedUsers()
  {
    UpsertResult result1 = await _repository.UpsertUser(new User { Name = "franz" });
    await _repository.UpsertUser(new User { Name = "max" });
    UpsertResult result3 = await _repository.UpsertUser(new User { Name = "gusti" });

    var users = await _userRestrictedRepository.GetUsers(result1.EntityId, result3.EntityId);

    users.Length.Should().Be(2);
  }

  [Test]
  public async Task UpsertUser_ShouldUpdate_CurrentUser()
  {
    IUser? current = await _repository.GetUser(CurrentUserName);
    current.Should().NotBeNull();

    UpsertResult result = await _userRestrictedRepository.UpsertUser(current);

    result.EntityId.Should().Be(_userRestrictedRepository.CurrentUser.Value.Id);
  }

  [Test]
  public void UpsertUser_ShouldThrow_WhenUpdating_OtherUser()
  {
    Assert.ThrowsAsync<NotAllowedOperationException>(async () => await _userRestrictedRepository.UpsertUser(
        new User { Id = _otherUserId, Name = OtherUserName }
      )
    );
  }

  [Test]
  public async Task UpsertJournal_Ensures_CurrentUser_Id()
  {
    IJournal journal = new TimerJournal();

    UpsertResult result = await _userRestrictedRepository.UpsertJournal(journal);
    IJournal? createdJournal = await _repository.GetJournal(result.EntityId);

    result.EntityId.Should().Be(createdJournal!.Id);
    _currentUserId.Should().Be(createdJournal.UserId);
  }

  [Test]
  public async Task UpsertJournal_ThrowsWhen_EntityFromOtherUser()
  {
    UpsertResult result = await _repository.UpsertJournal(new TimerJournal { UserId = _otherUserId });

    Assert.ThrowsAsync<NotAllowedOperationException>(async () =>
      {
        await _userRestrictedRepository.UpsertJournal(
          new TimerJournal
          {
            Id = result.EntityId,
            UserId = _otherUserId,
            Notes = "Random"
          }
        );
      }
    );
  }

  [Test]
  public async Task UpsertEntry_Ensures_CurrentUser_Id()
  {
    UpsertResult upsertJournal = await _userRestrictedRepository.UpsertJournal(new TimerJournal());
    var journalId = upsertJournal.EntityId;

    IEntry entry = new TimerEntry { ParentId = journalId };

    await _userRestrictedRepository.UpsertEntry(entry);
    var entries = await _repository.GetEntriesForJournal(journalId);

    entries.All(m => m.UserId == _currentUserId).Should().BeTrue();
  }

  [Test]
  public void UpsertEntry_ThrowsWhen_EntityFromOtherUser()
  {
    IEntry entry = new TimerEntry
    {
      ParentId = MongoUtil.GenerateNewIdAsString(),
      UserId = _otherUserId
    };

    Assert.ThrowsAsync<NotAllowedOperationException>(async () => { await _userRestrictedRepository.UpsertEntry(entry); }
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

    IJournal? journal = await _userRestrictedRepository.GetJournal(currentUserResult.EntityId);
    journal.Should().NotBeNull();
    journal.Name.Should().Be("From Current User");
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

    IJournal? journal = await _userRestrictedRepository.GetJournal(otherUserResult.EntityId);
    journal.Should().BeNull();
  }

  [Test]
  public async Task GetAllEntries()
  {
    UpsertResult currentUserJournalResult =
      await _repository.UpsertJournal(new CounterJournal { UserId = _currentUserId });

    var currentUserJournalId = currentUserJournalResult.EntityId;

    UpsertResult otherUserJournalResult
      = await _repository.UpsertJournal(new CounterJournal { UserId = _otherUserId });

    var otherUserJournalId = otherUserJournalResult.EntityId;

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

    var otherUserEntries = await _userRestrictedRepository.GetEntriesForJournal(otherUserJournalId);

    otherUserEntries.Should().BeEmpty();

    var currentUserEntries = await _userRestrictedRepository.GetEntriesForJournal(currentUserJournalId);
    currentUserEntries.Length.Should().Be(10);
  }

  [Test]
  public async Task DeleteEntry()
  {
    var journalId = MongoUtil.GenerateNewIdAsString();

    await _repository.UpsertJournal(new CounterJournal { Id = journalId, UserId = _currentUserId });

    UpsertResult result = await _repository.UpsertEntry(
      new CounterEntry
      {
        UserId = _currentUserId,
        Notes = "WillBeDeleted",
        ParentId = journalId
      }
    );

    IEntry? entry = await _repository.GetEntry(result.EntityId);
    entry!.Should().NotBeNull();

    await _userRestrictedRepository.DeleteEntry(result.EntityId);

    entry = await _repository.GetEntry(result.EntityId);
    entry.Should().BeNull();
  }

  [Test]
  public async Task DeleteEntry_ShouldNotDelete_FromOtherUser()
  {
    var journalId = MongoUtil.GenerateNewIdAsString();

    await _repository.UpsertJournal(new CounterJournal { Id = journalId, UserId = _currentUserId });

    UpsertResult result = await _repository.UpsertEntry(
      new CounterEntry
      {
        UserId = _otherUserId,
        Notes = "WillBeDeleted",
        ParentId = journalId
      }
    );

    IEntry? entry = await _repository.GetEntry(result.EntityId);
    entry.Should().NotBeNull();

    await _userRestrictedRepository.DeleteEntry(result.EntityId);
    entry.Should().NotBeNull();
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

    (await _repository.Journals.CountDocumentsAsync(FilterDefinition<JournalDocument>.Empty)).Should().Be(1);
    (await _repository.Entries.CountDocumentsAsync(FilterDefinition<EntryDocument>.Empty)).Should().Be(1);

    await _repository.DeleteJournal(journal.EntityId);

    (await _repository.GetAllJournals()).Length.Should().Be(0);
    (await _repository.Journals.CountDocumentsAsync(FilterDefinition<JournalDocument>.Empty)).Should().Be(0);
    (await _repository.Entries.CountDocumentsAsync(FilterDefinition<EntryDocument>.Empty)).Should().Be(0);
  }
}
