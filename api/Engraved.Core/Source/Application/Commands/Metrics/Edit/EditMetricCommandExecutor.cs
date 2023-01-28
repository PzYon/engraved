using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Utils;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Metrics.Edit;

public class EditMetricCommandExecutor : ICommandExecutor
{
  private readonly EditMetricCommand _command;

  public EditMetricCommandExecutor(EditMetricCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    if (string.IsNullOrEmpty(_command.MetricId))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditMetricCommand.MetricId)} must be specified.");
    }

    if (string.IsNullOrEmpty(_command.Name))
    {
      throw new InvalidCommandException(_command, $"{nameof(EditMetricCommand.Name)} must be specified.");
    }

    IMetric? metric = await repository.GetMetric(_command.MetricId);

    if (metric == null)
    {
      throw new InvalidCommandException(_command, $"Metric with key \"{_command.MetricId}\" does not exist.");
    }

    metric.Attributes = NormalizeKeys(_command.Attributes);
    metric.Name = _command.Name;
    metric.Description = _command.Description;
    metric.Notes = _command.Notes;
    metric.Thresholds = _command.Thresholds;
    metric.CustomProps = _command.CustomProps;
    metric.EditedOn = dateService.UtcNow;

    UpsertResult result = await repository.UpsertMetric(metric);

    return new CommandResult { EntityId = result.EntityId };
  }

  // todo: add tests for this stuff
  private static Dictionary<string, MetricAttribute> NormalizeKeys(Dictionary<string, MetricAttribute> attributes)
  {
    Dictionary<string, MetricAttribute> metricAttributes = KeyNormalizer.Normalize(attributes);

    foreach (KeyValuePair<string, MetricAttribute> metricAttribute in metricAttributes)
    {
      metricAttribute.Value.Values = KeyNormalizer.Normalize(metricAttribute.Value.Values);
    }

    return metricAttributes;
  }
}
