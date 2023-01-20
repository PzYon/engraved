using Metrix.Core.Domain.Permissions;

namespace Metrix.Core.Application.Commands.Metrics.EditPermissions;

public class EditMetricPermissionsCommand : ICommand
{
  public string? MetricId { get; set; }

  public Dictionary<string, PermissionKind>? Permissions { get; set; }

  public ICommandExecutor CreateExecutor()
  {
    return new EditMetricPermissionsCommandExecutor(this);
  }
}
