using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics.Add;

public class AddMetricCommandExecutor : ICommandExecutor
{
  private readonly AddMetricCommand _command;

  public AddMetricCommandExecutor(AddMetricCommand command)
  {
    _command = command;
  }

  public async Task Execute(IDb db, IDateService dateService)
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
    metric.Key = string.IsNullOrEmpty(_command.Key) ? Guid.NewGuid().ToString() : _command.Key;
    metric.Description = _command.Description;
    metric.Name = _command.Name;

    db.Metrics.Add(metric);
  }

  private static IMetric CreateMetric(MetricType type)
  {
    switch (type)
    {
      case MetricType.Counter:
        return new CounterMetric();
      case MetricType.Gauge:
        return new GaugeMetric();
      case MetricType.Timer:
        return new TimerMetric();
      default:
        throw new ArgumentOutOfRangeException(nameof(type), type, null);
    }
  }
}
