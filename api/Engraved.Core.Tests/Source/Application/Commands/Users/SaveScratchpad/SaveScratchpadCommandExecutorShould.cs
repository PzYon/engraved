using System;
using System.Threading.Tasks;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Users.SaveScratchpad;
using Engraved.Core.Application.Queries.Users.GetScratchpad;
using Engraved.Core.Domain.Users;
using Engraved.TestUtils;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Commands.Users.SaveScratchpad;

public class SaveScratchpadCommandExecutorShould
{
  private const string UserId = TestIds.UserId;

  private TestUserRestrictedMongoRepository _repo = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserRestrictedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(new User { Id = UserId, Name = UserId });
  }

  [Test]
  public async Task Return_NoScratchpad_When_NeverSaved()
  {
    UserScratchpad? scratchpad = await new GetScratchpadQueryExecutor(_repo.CurrentUser).Execute(
      new GetScratchpadQuery()
    );

    scratchpad.Should().BeNull();
  }

  [Test]
  public async Task Save_Content()
  {
    await Save("hello");

    (await _repo.GetUser(UserId))!.Scratchpad!.Content.Should().Be("hello");
  }

  [Test]
  public async Task Overwrite_PreviousSave()
  {
    await Save("first");

    await Save("second");

    (await _repo.GetUser(UserId))!.Scratchpad!.Content.Should().Be("second");
  }

  private Task<CommandResult> Save(string content)
  {
    return new SaveScratchpadCommandExecutor(_repo, _repo.CurrentUser).Execute(
      new SaveScratchpadCommand { Content = content }
    );
  }
}
