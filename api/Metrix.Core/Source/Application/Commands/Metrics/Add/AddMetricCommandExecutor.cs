using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics.Add;

public class AddMetricCommandExecutor : ICommandExecutor<AddMetricCommand>
{
  public void Execute(IDb db, AddMetricCommand command)
  {
    // todo:
    // - validate key is not null
    // - validate key is unique
    // - validate name is not null
    // - consider adding a created (and last modified?) date

    db.Metrics.Add(new Metric
    {
      Key = string.IsNullOrEmpty(command.Key) ? Guid.NewGuid().ToString() : command.Key,
      Description = command.Description,
      Name = command.Name,
      Type = command.Type
    });
  }
}
