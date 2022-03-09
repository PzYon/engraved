using Metrix.Core.Application.Persistence;
using Metrix.Core.Domain.Metrics;

namespace Metrix.Core.Application.Commands.Metrics.Add;

public class AddMetricCommandExecutor : ICommandExecutor
{
  private readonly AddMetricCommand _command;

  public AddMetricCommandExecutor(AddMetricCommand command)
  {
    _command = command;
  }

  public void Execute(IDb db)
  {
    // todo:
    // - validate key is not null
    // - validate key is unique
    // - validate name is not null
    // - consider adding a created (and last modified?) date

    db.Metrics.Add(new Metric
    {
      Key = string.IsNullOrEmpty(_command.Key) ? Guid.NewGuid().ToString() : _command.Key,
      Description = _command.Description,
      Name = _command.Name,
      Type = _command.Type
    });
  }
}
