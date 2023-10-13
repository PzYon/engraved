namespace Engraved.Core.Application.Commands;

public interface ICommandExecutor<TCommand> where TCommand : ICommand
{
  Task<CommandResult> Execute(TCommand command);
}
