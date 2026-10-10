using System.Text.Json.Serialization;

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

  // only ever needed to validate a refresh, so they must never leave the server
  [JsonIgnore]
  List<RefreshToken> RefreshTokens { get; set; }

  // served only by its own endpoints, so that it doesn't travel along with every login or refresh
  [JsonIgnore]
  UserScratchpad? Scratchpad { get; set; }

  bool IsAdmin { get; set; }
}
