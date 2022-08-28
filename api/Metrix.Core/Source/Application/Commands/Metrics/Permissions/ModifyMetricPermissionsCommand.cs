using Metrix.Core.Domain.Permissions;

namespace Metrix.Core.Application.Commands.Metrics.Permissions;

public class ModifyMetricPermissionsCommand : ICommand
{
  public string? MetricId { get; set; }

  public UserPermissions? Permissions { get; set; }

  public ICommandExecutor CreateExecutor()
  {
    return new ModifyMetricPermissionsCommandExecutor(this);
  }
}
