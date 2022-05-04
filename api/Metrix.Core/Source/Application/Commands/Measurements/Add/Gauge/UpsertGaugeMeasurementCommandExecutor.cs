using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Measurements;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Measurements.Add.Gauge;

public class UpsertGaugeMeasurementCommandExecutor : BaseUpsertMeasurementCommandExecutor<
  UpsertGaugeMeasurementCommand,
  GaugeMeasurement,
  GaugeMetric
>
{
  public UpsertGaugeMeasurementCommandExecutor(UpsertGaugeMeasurementCommand command) : base(command) { }

  protected override Task PerformAdditionalValidation(IRepository repository, GaugeMetric metric)
  {
    if (Command.Value == null)
    {
      throw CreateInvalidCommandException($"\"{nameof(UpsertGaugeMeasurementCommand.Value)}\" must be specified");
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
