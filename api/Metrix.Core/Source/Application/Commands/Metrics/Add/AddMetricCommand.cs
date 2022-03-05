
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics.Add;

public class AddMetricCommand : ICommand<AddMetricCommand>
{
  public string? Key { get; set; }

  public string? Name { get; set; }

  public string? Description { get; set; }
  
  public MetricType Type { get; set; }

  public ICommandExecutor<AddMetricCommand> CreateExecutor() => new AddMetricCommandExecutor();
}