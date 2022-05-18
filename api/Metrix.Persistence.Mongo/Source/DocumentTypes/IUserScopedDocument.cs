namespace Metrix.Persistence.Mongo.DocumentTypes;

public interface IUserScopedDocument : IDocument
{
  string? UserId { get; set; }
}
