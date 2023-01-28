using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Metrics.Add;

public class AddMetricCommand : ICommand
{
  public string? Name { get; set; }

  public string? Description { get; set; }

  public MetricType Type { get; set; }

  public ICommandExecutor CreateExecutor()
  {
    return new AddMetricCommandExecutor(this);
  }
}
