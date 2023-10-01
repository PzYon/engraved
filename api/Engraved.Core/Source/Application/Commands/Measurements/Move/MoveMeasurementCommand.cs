namespace Engraved.Core.Application.Commands.Measurements.Move;

public class MoveMeasurementCommand : ICommand
{
  public string MeasurementId { get; set; } = null!;
  
  public string TargetJournalId { get; set; } = null!;

  public ICommandExecutor CreateExecutor()
  {
    return new MoveMeasurementCommandExecutor(this);
  }
}
