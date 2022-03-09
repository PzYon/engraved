using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Commands;

public interface ICommandExecutor
{
  void Execute(IDb db);
}
