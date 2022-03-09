namespace Metrix.Core.Application.Commands;

public interface ICommand
{
  ICommandExecutor CreateExecutor();
}
