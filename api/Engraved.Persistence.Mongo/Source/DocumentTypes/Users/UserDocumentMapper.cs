using Engraved.Persistence.Mongo.DocumentTypes.Authentication;
using Engraved.Core.Domain.Users;
using MongoDB.Bson;

namespace Engraved.Persistence.Mongo.DocumentTypes.Users;

public static class UserDocumentMapper
{
  public static UserDocument ToDocument(IUser user)
  {
    var document = new UserDocument
    {
      GlobalUniqueId = user.GlobalUniqueId,
      Name = user.Name,
      DisplayName = user.DisplayName,
      ImageUrl = user.ImageUrl,
      LastLoginDate = user.LastLoginDate,
      IsAdmin = user.IsAdmin,
      FavoriteJournalIds = user.FavoriteJournalIds,
      Tags = user.Tags.Select(tag => new UserTag
          {
            Id = tag.Id,
            Label = tag.Label,
            JournalIds = tag.JournalIds
          }
        )
        .ToList(),
      RefreshTokens = user.RefreshTokens.Select(token => new RefreshTokenDocument
          {
            TokenHash = token.TokenHash,
            ExpiresAt = token.ExpiresAt,
            CreatedOn = token.CreatedOn
          }
        )
        .ToList()
    };

    if (!string.IsNullOrEmpty(user.Id))
    {
      document.Id = ObjectId.Parse(user.Id);
    }

    return document;
  }

  public static IUser? FromDocument(UserDocument? document)
  {
    if (document == null)
    {
      return null;
    }

    return new User
    {
      Id = document.Id.ToString(),
      GlobalUniqueId = document.GlobalUniqueId,
      Name = document.Name ?? string.Empty,
      DisplayName = document.DisplayName,
      ImageUrl = document.ImageUrl,
      LastLoginDate = document.LastLoginDate,
      IsAdmin = document.IsAdmin,
      FavoriteJournalIds = document.FavoriteJournalIds,
      Tags = document.Tags.Select(tag => new UserTag
          {
            Id = tag.Id,
            Label = tag.Label,
            JournalIds = tag.JournalIds
          }
        )
        .ToList(),
      RefreshTokens = document.RefreshTokens.Select(token => new RefreshToken
          {
            TokenHash = token.TokenHash,
            ExpiresAt = token.ExpiresAt,
            CreatedOn = token.CreatedOn
          }
        )
        .ToList()
    };
  }
}
