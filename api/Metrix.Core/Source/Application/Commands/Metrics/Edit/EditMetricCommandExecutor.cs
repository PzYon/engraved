using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics.Edit;

public class EditMetricCommandExecutor : ICommandExecutor
{
  private readonly EditMetricCommand _command;

  public EditMetricCommandExecutor(EditMetricCommand command)
  {
    _command = command;
  }

  public async Task Execute(IDb db, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.MetricKey))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditMetricCommand.MetricKey)} must be specified.");
    }

    if (string.IsNullOrEmpty(_command.Name))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditMetricCommand.Name)} must be specified.");
    }

    IMetric? metric = await db.GetMetric(_command.MetricKey);

    if (metric == null)
    {
      throw new InvalidCommandException(_command, $"Metric with key \"{_command.MetricKey}\" does not exist.");
    }

    metric.Flags = _command.Flags;
    metric.Name = _command.Name;
    metric.Description = _command.Description;

    await db.UpdateMetric(metric);
  }
}
