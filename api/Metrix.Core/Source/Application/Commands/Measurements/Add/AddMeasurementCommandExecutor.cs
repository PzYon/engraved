using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddMeasurementCommandExecutor : ICommandExecutor<AddMeasurementCommand>
{
  public void Execute(IDb db, AddMeasurementCommand command)
  {
    db.Measurements.Add(new Measurement
    {
      MetricKey = command.MetricKey,
      Notes = command.Notes,
      DateTime = DateTime.UtcNow,
      Value = 1
    });
  }
}
