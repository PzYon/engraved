using Metrix.Core.Domain.Permissions;

namespace Metrix.Persistence.Mongo.DocumentTypes;

public interface IUserScopedDocument : IDocument
{
  string? UserId { get; set; }
}

public interface IHasPerissionsDocument : IDocument
{
  Permissions Permissions { get; set; }
}
