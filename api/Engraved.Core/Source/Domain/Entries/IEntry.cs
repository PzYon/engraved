using Engraved.Core.Domain.Files;

namespace Engraved.Core.Domain.Entries;

// Values declared as IEntry are serialized polymorphically; see DomainPolymorphism.
public interface IEntry : IUserOwned, IEntity
{
  string ParentId { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  // Every file the entry owns. Deliberately says nothing about placement: a file listed below the
  // entry and one placed inline in the notes are the same thing here, and where it appears is the
  // markdown's business. One list means one lifecycle - deletion, quota accounting and orphan
  // detection all read this instead of parsing the notes to work out which files are referenced.
  FileRef[] Files { get; set; }

  Dictionary<string, string[]> JournalAttributeValues { get; set; }

  double GetValue();
}
