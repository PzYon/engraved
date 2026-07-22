using System;
using Engraved.Api.Admin;
using Engraved.Core.Application;
using FluentAssertions;
using NUnit.Framework;

namespace Engraved.Api.Tests.Admin;

public class DeleteUserConfirmationStoreShould
{
  private const string UserId = "60703c3b0000000000000001";
  private const string OtherUserId = "60703c3b0000000000000002";

  private FakeDateService _dateService = null!;
  private DeleteUserConfirmationStore _store = null!;

  [SetUp]
  public void SetUp()
  {
    _dateService = new FakeDateService();
    _store = new DeleteUserConfirmationStore(_dateService);
  }

  [Test]
  public void AcceptToken_ForTheUserItWasIssuedFor()
  {
    var token = _store.IssueToken(UserId);

    _store.TryConsumeToken(UserId, token).Should().BeTrue();
  }

  [Test]
  public void RejectToken_ForADifferentUser()
  {
    var token = _store.IssueToken(UserId);

    _store.TryConsumeToken(OtherUserId, token).Should().BeFalse();
  }

  [Test]
  public void RejectUnknownToken()
  {
    _store.TryConsumeToken(UserId, Guid.NewGuid()).Should().BeFalse();
  }

  [Test]
  public void BeSingleUse()
  {
    var token = _store.IssueToken(UserId);

    _store.TryConsumeToken(UserId, token).Should().BeTrue();

    // the same token must not work a second time, even for the correct user
    _store.TryConsumeToken(UserId, token).Should().BeFalse();
  }

  [Test]
  public void RejectToken_AlreadyConsumedByAMismatchedAttempt()
  {
    // a lookup consumes the token regardless of whether it turns out to be valid, so a wrong-user
    // attempt burns the token rather than leaving it available for a correct retry
    var token = _store.IssueToken(UserId);

    _store.TryConsumeToken(OtherUserId, token).Should().BeFalse();
    _store.TryConsumeToken(UserId, token).Should().BeFalse();
  }

  [Test]
  public void RejectToken_AfterItExpires()
  {
    var token = _store.IssueToken(UserId);

    _dateService.UtcNow = _dateService.UtcNow.AddMinutes(6);

    _store.TryConsumeToken(UserId, token).Should().BeFalse();
  }

  [Test]
  public void AcceptToken_JustBeforeItExpires()
  {
    var token = _store.IssueToken(UserId);

    _dateService.UtcNow = _dateService.UtcNow.AddMinutes(4);

    _store.TryConsumeToken(UserId, token).Should().BeTrue();
  }
}
