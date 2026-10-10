using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

public class MongoUserRepository_Scratchpad_Should
{
  private const string UserName = "me";
  private const string OtherUserName = "other";

  private static readonly DateTime FirstEdit = new(2026, 10, 1, 8, 0, 0, DateTimeKind.Utc);
  private static readonly DateTime SecondEdit = FirstEdit.AddMinutes(1);

  private TestMongoRepository _repository = null!;
  private string _userId = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
    _userId = (await _repository.UpsertUser(new User { Name = UserName })).EntityId;
  }

  [Test]
  public async Task Return_NoScratchpad_When_NeverSaved()
  {
    IUser user = (await _repository.GetUser(_userId))!;

    user.Scratchpad.Should().BeNull();
  }

  [Test]
  public async Task Save_FirstScratchpad()
  {
    var isSaved = await _repository.UpdateScratchpad(_userId, Scratchpad("hello", FirstEdit), null);

    isSaved.Should().BeTrue();
    IUser user = (await _repository.GetUser(_userId))!;
    user.Scratchpad!.Content.Should().Be("hello");
    user.Scratchpad.EditedOn.Should().Be(FirstEdit);
  }

  [Test]
  public async Task Save_When_LastKnownEditedOn_IsCurrent()
  {
    await _repository.UpdateScratchpad(_userId, Scratchpad("first", FirstEdit), null);

    var isSaved = await _repository.UpdateScratchpad(_userId, Scratchpad("second", SecondEdit), FirstEdit);

    isSaved.Should().BeTrue();
    (await _repository.GetUser(_userId))!.Scratchpad!.Content.Should().Be("second");
  }

  [Test]
  public async Task Reject_Save_When_SavedSince_LastKnownEditedOn()
  {
    await _repository.UpdateScratchpad(_userId, Scratchpad("first", FirstEdit), null);
    await _repository.UpdateScratchpad(_userId, Scratchpad("second", SecondEdit), FirstEdit);

    var isSaved = await _repository.UpdateScratchpad(_userId, Scratchpad("stale", SecondEdit.AddMinutes(1)), FirstEdit);

    isSaved.Should().BeFalse();
    (await _repository.GetUser(_userId))!.Scratchpad!.Content.Should().Be("second");
  }

  [Test]
  public async Task Reject_FirstSave_When_SavedElsewhere_Already()
  {
    await _repository.UpdateScratchpad(_userId, Scratchpad("elsewhere", FirstEdit), null);

    var isSaved = await _repository.UpdateScratchpad(_userId, Scratchpad("here", SecondEdit), null);

    isSaved.Should().BeFalse();
    (await _repository.GetUser(_userId))!.Scratchpad!.Content.Should().Be("elsewhere");
  }

  [Test]
  public async Task LeaveOtherUserFields_Untouched_When_SavingScratchpad()
  {
    IUser user = (await _repository.GetUser(_userId))!;
    user.DisplayName = "Me";
    user.FavoriteJournalIds.Add("journal-id");
    user.RefreshTokens.Add(new RefreshToken { TokenHash = "hash", CreatedOn = FirstEdit, ExpiresAt = SecondEdit });
    await _repository.UpsertUser(user);

    await _repository.UpdateScratchpad(_userId, Scratchpad("hello", FirstEdit), null);

    IUser reloaded = (await _repository.GetUser(_userId))!;
    reloaded.DisplayName.Should().Be("Me");
    reloaded.FavoriteJournalIds.Should().BeEquivalentTo("journal-id");
    reloaded.RefreshTokens.Should().ContainSingle().Which.TokenHash.Should().Be("hash");
  }

  [Test]
  public async Task LeaveScratchpad_Untouched_When_UpsertingUser_LoadedBeforeTheSave()
  {
    IUser loadedBeforeSave = (await _repository.GetUser(_userId))!;
    await _repository.UpdateScratchpad(_userId, Scratchpad("hello", FirstEdit), null);

    loadedBeforeSave.RefreshTokens.Add(new RefreshToken { TokenHash = "rotated" });
    await _repository.UpsertUser(loadedBeforeSave);

    IUser reloaded = (await _repository.GetUser(_userId))!;
    reloaded.Scratchpad!.Content.Should().Be("hello");
    reloaded.RefreshTokens.Should().ContainSingle().Which.TokenHash.Should().Be("rotated");
  }

  [Test]
  public async Task LeaveOtherUsers_Untouched()
  {
    var otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;

    await _repository.UpdateScratchpad(_userId, Scratchpad("mine", FirstEdit), null);

    (await _repository.GetUser(otherUserId))!.Scratchpad.Should().BeNull();
  }

  [Test]
  public async Task NotAllow_Saving_ScratchpadOfOtherUser_Through_RestrictedRepository()
  {
    var otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;
    TestUserRestrictedMongoRepository restrictedRepository =
      await Util.CreateUserRestrictedMongoRepository(UserName, _userId, true);

    Func<Task> save = () => restrictedRepository.UpdateScratchpad(otherUserId, Scratchpad("not mine", FirstEdit), null);

    await save.Should().ThrowAsync<NotAllowedOperationException>();
    (await _repository.GetUser(otherUserId))!.Scratchpad.Should().BeNull();
  }

  private static UserScratchpad Scratchpad(string content, DateTime editedOn)
  {
    return new UserScratchpad { Content = content, EditedOn = editedOn };
  }
}
