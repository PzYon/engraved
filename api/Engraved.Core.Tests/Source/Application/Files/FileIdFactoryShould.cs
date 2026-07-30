using Engraved.Core.Application.Files;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Core.Tests.Application.Files;

public class FileIdFactoryShould
{
  private const string UserId = "6a40b7027bf30b7c135049b4";
  private const string OtherUserId = "6a40b7027bf30b7c135049b3";

  private FileIdFactory _factory = null!;

  [SetUp]
  public void SetUp()
  {
    _factory = new FileIdFactory("a-signing-key");
  }

  [Test]
  public void Accept_AnIdItIssued_ToTheSameUser()
  {
    var fileId = _factory.Create(UserId);

    _factory.BelongsToUser(fileId, UserId).Should().BeTrue();
  }

  // The point of the whole mechanism: someone who has seen a file id cannot gain access to it by
  // attaching it to an entry of their own.
  [Test]
  public void Reject_AnIdIssued_ToSomeoneElse()
  {
    var fileId = _factory.Create(OtherUserId);

    _factory.BelongsToUser(fileId, UserId).Should().BeFalse();
  }

  [Test]
  public void Issue_A_DifferentId_EveryTime()
  {
    _factory.Create(UserId).Should().NotBe(_factory.Create(UserId));
  }

  [Test]
  public void Reject_An_UnsignedId()
  {
    _factory.BelongsToUser("8a1d3f9c4b2e4a7f9c0d1e2f", UserId).Should().BeFalse();
  }

  [TestCase("")]
  [TestCase(".")]
  [TestCase(".signature")]
  [TestCase("value.")]
  [TestCase("value.wrong")]
  public void Reject_MalformedIds(string fileId)
  {
    _factory.BelongsToUser(fileId, UserId).Should().BeFalse();
  }

  [Test]
  public void Reject_When_NoUserIsGiven()
  {
    var fileId = _factory.Create(UserId);

    _factory.BelongsToUser(fileId, "").Should().BeFalse();
  }

  // A signature made with a different key must not verify - otherwise the key would not be doing
  // anything.
  [Test]
  public void Reject_AnIdSignedWith_ADifferentKey()
  {
    var fileId = new FileIdFactory("a-different-key").Create(UserId);

    _factory.BelongsToUser(fileId, UserId).Should().BeFalse();
  }

  // The id ends up as a blob name and travels in URLs, so it must not need escaping.
  [Test]
  public void Produce_IdsThatAre_UrlAndBlobNameSafe()
  {
    _factory.Create(UserId).Should().MatchRegex("^[A-Za-z0-9._-]+$");
  }
}
