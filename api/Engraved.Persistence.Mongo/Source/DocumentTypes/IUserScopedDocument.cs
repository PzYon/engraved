using Engraved.Core.Domain.Permissions;

namespace Engraved.Persistence.Mongo.DocumentTypes;

public interface IUserScopedDocument : IDocument
{
  string? UserId { get; set; }
}

public interface IHasPermissionsDocument : IDocument
{
  UserPermissions Permissions { get; set; }
}
