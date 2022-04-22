using Metrix.Core.Application.Persistence;

namespace Metrix.Core.Application.Commands;

public interface ICommandExecutor
{
  Task Execute(IDb db, IDateService dateService);
}
