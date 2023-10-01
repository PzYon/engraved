namespace Engraved.Core.Domain.Measurements;

public interface IMeasurement : IUserScoped, IEditable
{
  string? Id { get; set; }

  string ParentId { get; set; }

  string? Notes { get; set; }

  DateTime? DateTime { get; set; }

  Dictionary<string, string[]> JournalAttributeValues { get; set; }

  double GetValue();
}
