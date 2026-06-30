using Engraved.Core.Domain.Permissions;

namespace Engraved.Persistence.Mongo.DocumentTypes;

public interface IUserOwnedDocument : IDocument
{
  string? UserId { get; set; }
}

public interface IHasPermissionsDocument : IDocument
{
  UserPermissions Permissions { get; set; }
}
