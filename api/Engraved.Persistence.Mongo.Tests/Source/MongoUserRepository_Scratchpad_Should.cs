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
    await _repository.UpdateScratchpad(_userId, Scratchpad("hello"));

    IUser user = (await _repository.GetUser(_userId))!;
    user.Scratchpad!.Content.Should().Be("hello");
  }

  [Test]
  public async Task Overwrite_PreviousSave()
  {
    await _repository.UpdateScratchpad(_userId, Scratchpad("first"));

    await _repository.UpdateScratchpad(_userId, Scratchpad("second"));

    (await _repository.GetUser(_userId))!.Scratchpad!.Content.Should().Be("second");
  }

  [Test]
  public async Task LeaveOtherUserFields_Untouched_When_SavingScratchpad()
  {
    IUser user = (await _repository.GetUser(_userId))!;
    user.DisplayName = "Me";
    user.FavoriteJournalIds.Add("journal-id");
    user.RefreshTokens.Add(new RefreshToken { TokenHash = "hash" });
    await _repository.UpsertUser(user);

    await _repository.UpdateScratchpad(_userId, Scratchpad("hello"));

    IUser reloaded = (await _repository.GetUser(_userId))!;
    reloaded.DisplayName.Should().Be("Me");
    reloaded.FavoriteJournalIds.Should().BeEquivalentTo("journal-id");
    reloaded.RefreshTokens.Should().ContainSingle().Which.TokenHash.Should().Be("hash");
  }

  [Test]
  public async Task LeaveScratchpad_Untouched_When_UpsertingUser_LoadedBeforeTheSave()
  {
    IUser loadedBeforeSave = (await _repository.GetUser(_userId))!;
    await _repository.UpdateScratchpad(_userId, Scratchpad("hello"));

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

    await _repository.UpdateScratchpad(_userId, Scratchpad("mine"));

    (await _repository.GetUser(otherUserId))!.Scratchpad.Should().BeNull();
  }

  [Test]
  public async Task NotAllow_Saving_ScratchpadOfOtherUser_Through_RestrictedRepository()
  {
    var otherUserId = (await _repository.UpsertUser(new User { Name = OtherUserName })).EntityId;
    TestUserRestrictedMongoRepository restrictedRepository =
      await Util.CreateUserRestrictedMongoRepository(UserName, _userId, true);

    Func<Task> save = () => restrictedRepository.UpdateScratchpad(otherUserId, Scratchpad("not mine"));

    await save.Should().ThrowAsync<NotAllowedOperationException>();
    (await _repository.GetUser(otherUserId))!.Scratchpad.Should().BeNull();
  }

  private static UserScratchpad Scratchpad(string content)
  {
    return new UserScratchpad { Content = content };
  }
}
