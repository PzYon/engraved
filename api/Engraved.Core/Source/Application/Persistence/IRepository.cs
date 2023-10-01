using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Persistence;

public interface IRepository
{
  Task<IUser?> GetUser(string name);

  Task<UpsertResult> UpsertUser(IUser user);

  Task<IUser[]> GetUsers(params string[] userIds);

  Task<IUser[]> GetAllUsers();

  Task<IJournal[]> GetAllJournals(string? searchText = null, JournalType[]? journalTypes = null, int? limit = null);

  Task<IJournal?> GetJournal(string journalId);

  Task<UpsertResult> UpsertJournal(IJournal journal);

  Task DeleteJournal(string journalId);

  Task ModifyJournalPermissions(string metricId, Dictionary<string, PermissionKind> permissions);

  Task<IMeasurement[]> GetAllMeasurements(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  );

  Task<IMeasurement[]> GetLastEditedMeasurements(
    string[]? journalIds,
    string? searchText,
    JournalType[]? metricTypes,
    int limit
  );

  Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement;

  Task DeleteMeasurement(string measurementId);

  Task<IMeasurement?> GetMeasurement(string measurementId);

  Task WakeMeUp();
}
