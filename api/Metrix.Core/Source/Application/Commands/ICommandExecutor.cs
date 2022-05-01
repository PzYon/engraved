using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Commands;

public interface ICommandExecutor
{
  Task<CommandResult> Execute(IRepository repository, IDateService dateService);
}
