using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Metrics.Add;

public class AddMetricCommandExecutor : ICommandExecutor
{
  private readonly AddMetricCommand _command;

  public AddMetricCommandExecutor(AddMetricCommand command)
  {
    _command = command;
  }

  public async Task<CommandResult> Execute(IRepository repository, IDateService dateService)
  {
    // todo:
    // - validate key is not null
    // - validate key is unique
    // - validate name is not null (done below -> add test)
    // - consider adding a created (and last modified?) date

    if (string.IsNullOrEmpty(_command.Name))
    {
      throw new InvalidCommandException(_command, $"\"{nameof(_command.Name)}\" must be specified");
    }

    IMetric metric = CreateMetric(_command.Type);
    metric.Description = _command.Description;
    metric.Name = _command.Name;
    metric.EditedOn = dateService.UtcNow;

    UpsertResult result = await repository.UpsertMetric(metric);

    return new CommandResult(result.EntityId, Array.Empty<string>());
  }

  private static IMetric CreateMetric(MetricType type)
  {
    return type switch
    {
      MetricType.Counter => new CounterMetric(),
      MetricType.Gauge => new GaugeMetric(),
      MetricType.Timer => new TimerMetric(),
      MetricType.Notes => new NotesMetric(),
      MetricType.Scraps => new ScrapsMetric(),
      _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
    };
  }
}
