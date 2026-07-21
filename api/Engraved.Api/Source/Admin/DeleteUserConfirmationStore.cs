using System.Collections.Concurrent;
using Engraved.Core.Application;

namespace Engraved.Api.Admin;

// A short-lived, single-use confirmation token for the "delete user" flow: the client must first
// request a token (proving it went through the confirm-by-typing-the-name UI step) and then present
// that exact token with the delete request, so a stray or scripted call to the delete endpoint with
// just a user id can never succeed on its own. In-memory is fine here - there is only one API
// instance, and tokens are short-lived and per-request, so nothing needs to survive a restart.
public class DeleteUserConfirmationStore(IDateService dateService)
{
  private static readonly TimeSpan TokenLifetime = TimeSpan.FromMinutes(5);

  private readonly ConcurrentDictionary<Guid, PendingConfirmation> _pendingConfirmations = new();

  public Guid IssueToken(string userId)
  {
    var token = Guid.NewGuid();
    _pendingConfirmations[token] = new PendingConfirmation(userId, dateService.UtcNow.Add(TokenLifetime));
    return token;
  }

  // Single-use: a matching entry is removed as soon as it is looked up, whether or not it turns out
  // to be valid for the given user, so a token can never be presented twice.
  public bool TryConsumeToken(string userId, Guid token)
  {
    if (!_pendingConfirmations.TryRemove(token, out PendingConfirmation? confirmation))
    {
      return false;
    }

    return confirmation.UserId == userId && confirmation.ExpiresAt > dateService.UtcNow;
  }

  private record PendingConfirmation(string UserId, DateTime ExpiresAt);
}
