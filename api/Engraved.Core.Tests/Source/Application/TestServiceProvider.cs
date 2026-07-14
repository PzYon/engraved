using System;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Queries.Entries.Search;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain.Journals;
using Engraved.TestUtils;

namespace Engraved.Core.Tests.Application;

public class TestServiceProvider(TestUserRestrictedMongoRepository repository) : IServiceProvider
{
  public object GetService(Type serviceType)
  {
    if (serviceType == typeof(IQueryExecutor<Guid, FakeQuery>))
    {
      return new FakeQueryExecutor();
    }

    if (serviceType == typeof(ICommandExecutor<FakeCommand>))
    {
      return new FakeCommandExecutor();
    }

    if (serviceType == typeof(IQueryExecutor<IJournal[], GetAllJournalsQuery>))
    {
      return new GetAllJournalsQueryExecutor(repository, repository, repository.CurrentUser);
    }

    if (serviceType == typeof(IQueryExecutor<SearchEntriesQueryResult, SearchEntriesQuery>))
    {
      return new SearchEntriesQueryExecutor(repository, repository, repository.CurrentUser);
    }

    throw new Exception($"Service of type {serviceType.FullName} is not available in {nameof(TestServiceProvider)}.");
  }
}
