using Engraved.Core.Domain.Files;

namespace Engraved.Core.Domain.Entries;

// Values declared as IEntry are serialized polymorphically; see DomainPolymorphism.
public interface IEntry : IUserOwned, IEntity
{
  string ParentId { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  // Every file the entry owns, whether listed as an attachment or placed inline in the notes. One
  // list means one lifecycle: deletion, quota accounting and orphan detection all read this instead
  // of parsing the notes to work out which files are referenced.
  FileRef[] Attachments { get; set; }

  Dictionary<string, string[]> JournalAttributeValues { get; set; }

  double GetValue();
}
