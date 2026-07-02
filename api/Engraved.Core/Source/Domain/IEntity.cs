using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Domain;

// Values declared as IEntity are serialized polymorphically; see DomainPolymorphism.
public interface IEntity : IEditable, IScheduled
{
  string? Id { get; set; }
}
