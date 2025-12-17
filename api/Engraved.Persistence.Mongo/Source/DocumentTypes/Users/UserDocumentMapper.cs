using Engraved.Core.Domain.Users;

namespace Engraved.Persistence.Mongo.DocumentTypes.Users;

public static class UserDocumentMapper
{
  public static UserDocument ToDocument(IUser user)
  {
    return new UserDocument
    {
      GlobalUniqueId = user.GlobalUniqueId,
      Name = user.Name,
      DisplayName = user.DisplayName,
      ImageUrl = user.ImageUrl,
      LastLoginDate = user.LastLoginDate,
      FavoriteJournalIds = user.FavoriteJournalIds,
      Tags = user.Tags.Select(tag => new UserTag
          {
            Id = tag.Id,
            Label = tag.Label,
            JournalIds = tag.JournalIds
          }
        )
        .ToList()
    };
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
      FavoriteJournalIds = document.FavoriteJournalIds,
      Tags = document.Tags.Select(tag => new UserTag
          {
            Id = tag.Id,
            Label = tag.Label,
            JournalIds = tag.JournalIds
          }
        )
        .ToList()
    };
  }
}
