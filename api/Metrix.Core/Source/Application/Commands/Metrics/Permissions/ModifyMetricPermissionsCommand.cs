namespace Metrix.Core.Application.Commands.Metrics.Permissions;

public class ModifyMetricPermissionsCommand : ICommand
{
  public string? MetricId { get; set; }

  public Domain.Permissions.Permissions? Permissions { get; set; }

  public ICommandExecutor CreateExecutor()
  {
    return new ModifyMetricPermissionsCommandExecutor(this);
  }
}