using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Commands.Metrics.Permissions;

public class ModifyMetricPermissionsCommandExecutor : ICommandExecutor
{
  private readonly ModifyMetricPermissionsCommand _command;

  public ModifyMetricPermissionsCommandExecutor(ModifyMetricPermissionsCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.MetricId))
    {
      throw new InvalidCommandException(_command, $"{nameof(ModifyMetricPermissionsCommand.MetricId)} is required");
    }

    if (_command.Permissions?.Count > 0)
    {
      await repository.ModifyMetricPermissions(_command.MetricId, _command.Permissions);
    }

    return new CommandResult();
  }
}
