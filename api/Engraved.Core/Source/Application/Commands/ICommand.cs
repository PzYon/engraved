namespace Engraved.Core.Application.Commands;

public interface ICommand
{
  ICommandExecutor CreateExecutor();
}
