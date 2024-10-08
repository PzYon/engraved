﻿namespace Engraved.Core.Domain.Users;

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
}
