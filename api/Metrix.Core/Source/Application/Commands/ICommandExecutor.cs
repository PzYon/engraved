using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Commands;

public interface ICommandExecutor
{
  Task Execute(IRepository repository, IDateService dateService);
}
