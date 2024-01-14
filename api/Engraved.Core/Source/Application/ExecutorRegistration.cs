using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Delete;
using Engraved.Core.Application.Commands.Entries.Move;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Commands.Entries.Upsert.Timer;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Journals.AddSchedule;
using Engraved.Core.Application.Commands.Journals.Delete;
using Engraved.Core.Application.Commands.Journals.Edit;
using Engraved.Core.Application.Commands.Journals.EditPermissions;
using Engraved.Core.Application.Commands.Users.AddJournalToFavorites;
using Engraved.Core.Application.Commands.Users.RemoveJournalFromFavorites;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Queries.Entries.GetActive;
using Engraved.Core.Application.Queries.Entries.GetAll;
using Engraved.Core.Application.Queries.Entries.GetAllJournal;
using Engraved.Core.Application.Queries.Journals.Get;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Application.Queries.Journals.GetThresholdValues;
using Engraved.Core.Application.Queries.Search.Entities;
using Engraved.Core.Application.Queries.SystemInfo.Get;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Microsoft.Extensions.DependencyInjection;

namespace Engraved.Core.Application;

public class ExecutorRegistration
{
  public static void RegisterCommands(IServiceCollection services)
  {
    RegisterCommand<AddJournalCommand, AddJournalCommandExecutor>(services);
    RegisterCommand<AddJournalToFavoritesCommand, AddJournalToFavoritesCommandExecutor>(services);
    RegisterCommand<UpsertCounterEntryCommand, UpsertCounterEntryCommandExecutor>(services);
    RegisterCommand<UpsertGaugeEntryCommand, UpsertGaugeEntryCommandExecutor>(services);
    RegisterCommand<UpsertScrapsEntryCommand, UpsertScrapsEntryCommandExecutor>(services);
    RegisterCommand<UpsertTimerEntryCommand, UpsertTimerEntryCommandExecutor>(services);
    RegisterCommand<DeleteEntryCommand, DeleteEntryCommandExecutor>(services);
    RegisterCommand<DeleteJournalCommand, DeleteJournalCommandExecutor>(services);
    RegisterCommand<EditJournalCommand, EditJournalCommandExecutor>(services);
    RegisterCommand<EditJournalPermissionsCommand, EditJournalPermissionsCommandExecutor>(services);
    RegisterCommand<MoveEntryCommand, MoveEntryCommandExecutor>(services);
    RegisterCommand<RemoveJournalFromFavoritesCommand, RemoveJournalFromFavoritesCommandExecutor>(services);
    RegisterCommand<AddScheduleCommand, AddScheduleCommandExecutor>(services);
  }

  private static void RegisterCommand<TCommand, TCommandExecutor>(IServiceCollection services)
    where TCommand : ICommand
    where TCommandExecutor : class, ICommandExecutor<TCommand>
  {
    services.AddTransient<ICommandExecutor<TCommand>, TCommandExecutor>();
  }

  public static void RegisterQueries(IServiceCollection services)
  {
    RegisterQuery<IEntry?, GetActiveEntryQuery, GetActiveEntryQueryExecutor>(services);
    RegisterQuery<GetAllEntriesQueryResult, GetAllEntriesQuery, GetAllEntriesQueryExecutor>(services);
    RegisterQuery<IEntry[], GetAllJournalEntriesQuery, GetAllJournalEntriesQueryExecutor>(services);
    RegisterQuery<IJournal[], GetAllJournalsQuery, GetAllJournalsQueryExecutor>(services);
    RegisterQuery<IJournal?, GetJournalQuery, GetJournalQueryExecutor>(services);
    RegisterQuery<IDictionary<string, IDictionary<string, ThresholdResult>>, GetThresholdValuesQuery,
      GetThresholdValuesQueryExecutor>(services);
    RegisterQuery<SearchEntitiesResult, SearchEntitiesQuery, SearchEntitiesQueryExecutor>(services);
    RegisterQuery<SystemInfo, GetSystemInfoQuery, GetSystemInfoQueryExecutor>(services);
  }

  private static void RegisterQuery<TResult, TQuery, TQueryExecutor>(IServiceCollection services)
    where TQuery : IQuery
    where TQueryExecutor : class, IQueryExecutor<TResult, TQuery>
  {
    services.AddTransient<IQueryExecutor<TResult, TQuery>, TQueryExecutor>();
  }
}
