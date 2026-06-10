using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Application.Commands.Users.UpdateTags;

public class UpdateUserTagsCommandExecutorShould
{
  private UserScopedInMemoryRepository _repo = null!;

  private const string UserId = "max";

  [SetUp]
  public void SetUp()
  {
    var inMemoryRepository = new InMemoryRepository();
    inMemoryRepository.Users.Add(new User { Id = UserId, Name = UserId });
    _repo = new UserScopedInMemoryRepository(inMemoryRepository, new FakeCurrentUserService(UserId));
  }

  [Test]
  public async Task AddNewTag()
  {
    // when
    await new UpdateUserTagsCommandExecutor(_repo).Execute(
      new UpdateUserTagsCommand { TagNames = new Dictionary<string, string> { { "tag-id", "Label" } } }
    );

    // then
    UserTag tag = _repo.Users[0].Tags.Should().ContainSingle().Subject;
    tag.Id.Should().Be("tag-id");
    tag.Label.Should().Be("Label");
  }

  [Test]
  public async Task UpdateLabelOfExistingTag()
  {
    // given
    _repo.Users[0].Tags.Add(new UserTag { Id = "tag-id", Label = "Old" });

    // when
    await new UpdateUserTagsCommandExecutor(_repo).Execute(
      new UpdateUserTagsCommand { TagNames = new Dictionary<string, string> { { "tag-id", "New" } } }
    );

    // then
    UserTag tag = _repo.Users[0].Tags.Should().ContainSingle().Subject;
    tag.Id.Should().Be("tag-id");
    tag.Label.Should().Be("New");
  }

  [Test]
  public async Task RemoveTagsNoLongerInCommand()
  {
    // given
    _repo.Users[0].Tags.Add(new UserTag { Id = "keep", Label = "Keep" });
    _repo.Users[0].Tags.Add(new UserTag { Id = "remove", Label = "Remove" });

    // when
    await new UpdateUserTagsCommandExecutor(_repo).Execute(
      new UpdateUserTagsCommand { TagNames = new Dictionary<string, string> { { "keep", "Keep" } } }
    );

    // then
    _repo.Users[0].Tags.Select(t => t.Id).Should().BeEquivalentTo("keep");
  }
}
