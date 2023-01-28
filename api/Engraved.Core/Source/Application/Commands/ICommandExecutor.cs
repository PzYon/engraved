using Engraved.Core.Application.Persistence;

namespace Engraved.Core.Application.Commands;

public interface ICommandExecutor
{
  Task<CommandResult> Execute(IRepository repository, IDateService dateService);
}
