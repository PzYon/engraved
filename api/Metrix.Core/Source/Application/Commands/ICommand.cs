namespace Metrix.Core.Application.Commands;

public interface ICommand<TCommand> where TCommand : ICommand<TCommand>
{
  ICommandExecutor<TCommand> CreateExecutor();
}
