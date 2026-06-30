using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.Tests;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.UpdateTags;

public class UpdateUserTagsCommandExecutorShould
{
  private TestUserRestrictedMongoRepository _repo = null!;

  private const string UserId = TestIds.UserId;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserRestrictedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(new User { Id = UserId, Name = UserId });
  }

  [Test]
  public async Task AddNewTag()
  {
    // when
    await new UpdateUserTagsCommandExecutor(_repo).Execute(
      new UpdateUserTagsCommand { TagNames = new Dictionary<string, string> { { "tag-id", "Label" } } }
    );

    // then
    IUser user = (await _repo.GetUser(UserId))!;
    UserTag tag = user.Tags.Should().ContainSingle().Subject;
    tag.Id.Should().Be("tag-id");
    tag.Label.Should().Be("Label");
  }

  [Test]
  public async Task UpdateLabelOfExistingTag()
  {
    // given
    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "tag-id", Label = "Old" });
    await _repo.UpsertUser(user);

    // when
    await new UpdateUserTagsCommandExecutor(_repo).Execute(
      new UpdateUserTagsCommand { TagNames = new Dictionary<string, string> { { "tag-id", "New" } } }
    );

    // then
    user = (await _repo.GetUser(UserId))!;
    UserTag tag = user.Tags.Should().ContainSingle().Subject;
    tag.Id.Should().Be("tag-id");
    tag.Label.Should().Be("New");
  }

  [Test]
  public async Task RemoveTagsNoLongerInCommand()
  {
    // given
    IUser user = (await _repo.GetUser(UserId))!;
    user.Tags.Add(new UserTag { Id = "keep", Label = "Keep" });
    user.Tags.Add(new UserTag { Id = "remove", Label = "Remove" });
    await _repo.UpsertUser(user);

    // when
    await new UpdateUserTagsCommandExecutor(_repo).Execute(
      new UpdateUserTagsCommand { TagNames = new Dictionary<string, string> { { "keep", "Keep" } } }
    );

    // then
    user = (await _repo.GetUser(UserId))!;
    user.Tags.Select(t => t.Id).Should().BeEquivalentTo("keep");
  }
}
