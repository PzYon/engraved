using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics.Edit;

public class EditMetricCommand : ICommand
{
  public string? MetricId { get; set; }

  public string? Name { get; set; }

  public string? Description { get; set; }

  public Dictionary<string, MetricAttribute> Flags { get; set; } = new();

  public ICommandExecutor CreateExecutor()
  {
    return new EditMetricCommandExecutor(this);
  }
}
