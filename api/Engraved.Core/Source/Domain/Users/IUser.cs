namespace Engraved.Core.Domain.Users;

public interface IUser
{
  string? Id { get; set; }

  Guid? GlobalUniqueId { get; set; }

  string Name { get; set; }

  string? DisplayName { get; set; }

  string? ImageUrl { get; set; }

  DateTime? LastLoginDate { get; set; }

  List<string> FavoriteJournalIds { get; set; }

  public List<UserTag> Tags { get; set; }

  List<RefreshToken> RefreshTokens { get; set; }

  // Not persisted - computed per-request from the admin email allowlist by whoever resolves the
  // current user (see AdminAuthorizationService), and only meaningful on that response.
  bool IsAdmin { get; set; }
}
