namespace Engraved.Core.Domain;

public interface IEntity : IEditable
{
  string? Id { get; set; }
}
