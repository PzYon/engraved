using System;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;

namespace Engraved.Core.Application;

public class TestServiceProvider(IUserScopedRepository userScopedRepository)
  : IServiceProvider
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
      return new GetAllJournalsQueryExecutor(userScopedRepository);
    }

    if (serviceType == typeof(IQueryExecutor<GetAllEntriesQueryResult, GetAllEntriesQuery>))
    {
      return new GetAllEntriesQueryExecutor(userScopedRepository);
    }

    throw new Exception($"Service of type {serviceType.FullName} is not available in {nameof(TestServiceProvider)}.");
  }
}
