using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Metrics.EditPermissions;

public class EditMetricPermissionsCommandExecutor : ICommandExecutor
{
  private readonly EditMetricPermissionsCommand _command;

  public EditMetricPermissionsCommandExecutor(EditMetricPermissionsCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.MetricId))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditMetricPermissionsCommand.MetricId)} is required");
    }

    IMetric metricBefore = (await repository.GetMetric(_command.MetricId))!;

    if (_command.Permissions?.Count > 0)
    {
      await repository.ModifyMetricPermissions(_command.MetricId, _command.Permissions);
    }

    IMetric metricAfter = (await repository.GetMetric(_command.MetricId))!;

    // users are affected that have permissions before or after
    string[] userIdsWithAccess = metricBefore.Permissions.GetUserIdsWithAccess()
      .Union(metricAfter.Permissions.GetUserIdsWithAccess())
      .Distinct()
      .ToArray();

    return new CommandResult(_command.MetricId, userIdsWithAccess);
  }
}
