namespace Metrix.Core.Application.Commands.Measurements.Delete;

public class DeleteMeasurementCommand : ICommand
{
  public string Id { get; set; } = null!;

  public ICommandExecutor CreateExecutor()
  {
    return new DeleteMeasurementCommandExecutor(this);
  }
}
