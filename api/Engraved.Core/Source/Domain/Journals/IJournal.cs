using Engraved.Core.Domain.Permissions;

namespace Engraved.Core.Domain.Journals;

public interface IJournal : IUserScoped, IPermissionHolder, IEntity
{
  string? Id { get; set; }

  string Name { get; set; }

  string? Description { get; set; }

  string? Notes { get; set; }

  JournalType Type { get; }

  Dictionary<string, JournalAttribute> Attributes { get; set; }

  Dictionary<string, Dictionary<string, double>> Thresholds { get; set; }

  // basic idea here is to enable clients to store whatever they want while
  // the server is completely unaware of what's going on here. i.e. server
  // does not know, what he's actually storing. this way there's also no
  // server side serialization required, etc.
  Dictionary<string, string> CustomProps { get; set; }
}
