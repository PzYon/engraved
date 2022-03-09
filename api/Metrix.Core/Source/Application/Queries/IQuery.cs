namespace Metrix.Core.Application.Queries;

public interface IQuery<TResult> 
{
  IQueryExecutor<TResult> CreateExecutor();
}
