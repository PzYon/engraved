using Engraved.Core.Domain.Authentication;

namespace Engraved.Persistence.Mongo.DocumentTypes.Authentication;

public static class RefreshTokenDocumentMapper
{
  public static RefreshTokenDocument ToDocument(RefreshToken refreshToken)
  {
    return new RefreshTokenDocument
    {
      UserId = refreshToken.UserId,
      TokenHash = refreshToken.TokenHash,
      ExpiresAt = refreshToken.ExpiresAt,
      CreatedOn = refreshToken.CreatedOn
    };
  }

  public static RefreshToken? FromDocument(RefreshTokenDocument? document)
  {
    if (document == null)
    {
      return null;
    }

    return new RefreshToken
    {
      Id = document.Id.ToString(),
      UserId = document.UserId,
      TokenHash = document.TokenHash,
      ExpiresAt = document.ExpiresAt,
      CreatedOn = document.CreatedOn
    };
  }
}
