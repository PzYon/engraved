using System;
using System.Threading.Tasks;
using Engraved.Core.Application;
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

  private static readonly DateTime Now = new(2026, 10, 1, 8, 0, 0, 123, DateTimeKind.Utc);

  private TestUserRestrictedMongoRepository _repo = null!;
  private FakeDateService _dateService = null!;

  [SetUp]
  public async Task SetUp()
  {
    _repo = await Util.CreateUserRestrictedMongoRepository(UserId, UserId, false);
    await _repo.UpsertUser(new User { Id = UserId, Name = UserId });
    _dateService = new FakeDateService(Now.AddTicks(4567));
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
  public async Task Save_And_Return_EditedOn_AsStored()
  {
    var result = (SaveScratchpadCommandResult)await Save("hello");

    result.EditedOn.Should().Be(Now, "MongoDB keeps milliseconds only");

    UserScratchpad scratchpad = (await _repo.GetUser(UserId))!.Scratchpad!;
    scratchpad.Content.Should().Be("hello");
    scratchpad.EditedOn.Should().Be(result.EditedOn);
  }

  [Test]
  public async Task Overwrite_PreviousSave()
  {
    await Save("first");
    _dateService.UtcNow = Now.AddMinutes(1);

    var result = (SaveScratchpadCommandResult)await Save("second");

    UserScratchpad scratchpad = (await _repo.GetUser(UserId))!.Scratchpad!;
    scratchpad.Content.Should().Be("second");
    scratchpad.EditedOn.Should().Be(result.EditedOn);
  }

  [Test]
  public async Task Throw_When_Content_IsTooLong()
  {
    Func<Task> save = () => Save(new string('x', SaveScratchpadCommandExecutor.MaxContentLength + 1));

    await save.Should().ThrowAsync<InvalidCommandException>();
    (await _repo.GetUser(UserId))!.Scratchpad.Should().BeNull();
  }

  private Task<CommandResult> Save(string content)
  {
    return new SaveScratchpadCommandExecutor(_repo, _repo.CurrentUser, _dateService).Execute(
      new SaveScratchpadCommand { Content = content }
    );
  }
}
