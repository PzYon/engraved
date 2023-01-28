using Engraved.Core.Domain.Metrics;

namespace Engraved.Core.Application.Commands.Metrics.Edit;

public class EditMetricCommand : ICommand
{
  public string? MetricId { get; set; }

  public string? Name { get; set; }

  public string? Description { get; set; }

  public string? Notes { get; set; }

  public Dictionary<string, MetricAttribute> Attributes { get; set; } = new();

  public Dictionary<string, Dictionary<string, double>> Thresholds { get; set; } = new();

  public Dictionary<string, string> CustomProps { get; set; } = new();

  public ICommandExecutor CreateExecutor()
  {
    return new EditMetricCommandExecutor(this);
  }
}
