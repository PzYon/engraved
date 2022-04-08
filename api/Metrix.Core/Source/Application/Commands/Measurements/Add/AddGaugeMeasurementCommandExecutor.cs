using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add;

public class AddGaugeMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<
  AddGaugeMeasurementCommand,
  GaugeMeasurement
>
{
  public AddGaugeMeasurementCommandExecutor(AddGaugeMeasurementCommand command) : base(command) { }

  protected override void PerformAdditionalValidation(IDb db, IMetric metric)
  {
    if (Command.Value == null)
    {
      throw CreateInvalidCommandException($"\"{nameof(AddGaugeMeasurementCommand.Value)}\" must be specified");
    }
  }

  protected override GaugeMeasurement CreateMeasurement()
  {
    return new GaugeMeasurement
    {
      Value = Command.Value!.Value
    };
  }
}
