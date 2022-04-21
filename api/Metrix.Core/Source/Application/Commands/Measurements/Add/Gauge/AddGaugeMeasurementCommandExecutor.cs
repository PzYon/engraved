using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Gauge;

public class AddGaugeMeasurementCommandExecutor : BaseAddMeasurementCommandExecutor<
  AddGaugeMeasurementCommand,
  GaugeMeasurement,
  GaugeMetric
>
{
  public AddGaugeMeasurementCommandExecutor(AddGaugeMeasurementCommand command) : base(command) { }

  protected override Task PerformAdditionalValidation(IDb db, GaugeMetric metric)
  {
    if (Command.Value == null)
    {
      throw CreateInvalidCommandException($"\"{nameof(AddGaugeMeasurementCommand.Value)}\" must be specified");
    }

    return Task.CompletedTask;
  }

  protected override GaugeMeasurement CreateMeasurement(IDateService dateService)
  {
    return new GaugeMeasurement
    {
      Value = Command.Value!.Value
    };
  }
}
