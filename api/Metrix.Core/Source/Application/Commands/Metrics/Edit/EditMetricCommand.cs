namespace Metrix.Core.Application.Commands.Metrics.Edit;

public class EditMetricCommand : ICommand
{
  public string MetricKey { get; set; }

  public string? Name { get; set; }
  
  public Dictionary<string, string> Flags { get; set; } = new();

  public ICommandExecutor CreateExecutor()
  {
    return new EditMetricCommandExecutor(this);
  }
}
