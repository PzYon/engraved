using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Commands;

public interface ICommandExecutor<TCommand> where TCommand : ICommand<TCommand>
{
  void Execute(IDb db, TCommand command);
}
