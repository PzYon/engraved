namespace Engraved.Core.Domain.Entries;

// Values declared as IEntry are serialized polymorphically; see DomainPolymorphism.
public interface IEntry : IUserOwned, IEntity
{
  string ParentId { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  Dictionary<string, string[]> JournalAttributeValues { get; set; }

  double GetValue();
}
