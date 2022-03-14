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

  public void Execute(IDb db)
  {
    if (string.IsNullOrEmpty(_command.MetricKey))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditMetricCommand.MetricKey)} must be specified.");
    }

    Metric? metric = db.Metrics.FirstOrDefault(m => m.Key == _command.MetricKey);

    if (metric == null)
    {
      throw new InvalidCommandException(_command, $"Metric with key \"{_command.MetricKey}\" does not exist.");
    }

    metric.Flags = _command.Flags;
  }
}
