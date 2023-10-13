using Engraved.Core.Domain.Permissions;

namespace Engraved.Core.Application.Commands.Journals.EditPermissions;

public class EditJournalPermissionsCommand : ICommand
{
  public string? JournalId { get; set; }

  public Dictionary<string, PermissionKind>? Permissions { get; set; }
}
