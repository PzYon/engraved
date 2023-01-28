namespace Engraved.Core.Application.Commands.Metrics.Delete;

public class DeleteMetricCommand : ICommand
{
  public string Id { get; set; } = null!;

  public ICommandExecutor CreateExecutor()
  {
    return new DeleteMetricCommandExecutor(this);
  }
}
