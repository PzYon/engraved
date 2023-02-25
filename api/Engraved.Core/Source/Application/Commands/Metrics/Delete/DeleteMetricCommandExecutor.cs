using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Metrics.Delete;

public class DeleteMetricCommandExecutor : ICommandExecutor
{
  private readonly DeleteMetricCommand _command;

  public DeleteMetricCommandExecutor(DeleteMetricCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    IMetric? metric = await repository.GetMetric(_command.Id);
    if (metric == null)
    {
      return new CommandResult();
    }

    await repository.DeleteMetric(_command.Id);

    return new CommandResult(_command.Id, metric.Permissions.GetUserIdsWithAccess());
  }
}
