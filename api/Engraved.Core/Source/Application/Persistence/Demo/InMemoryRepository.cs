using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Persistence.Demo;

public class InMemoryRepository : IRepository
{
  public List<IUser> Users { get; } = new();

  public List<IMeasurement> Measurements { get; } = new();

  public List<IJournal> Journals { get; } = new();

  public Task<IUser?> GetUser(string name)
  {
    return Task.FromResult(Users.FirstOrDefault(u => u.Name == name));
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    if (string.IsNullOrEmpty(user.Id))
    {
      user.Id = GenerateId();
    }
    else
    {
      RemoveUser(user);
    }

    Users.Add(user.Copy());

    return Task.FromResult(new UpsertResult { EntityId = user.Id });
  }

  public async Task<IUser[]> GetUsers(string[] userIds)
  {
    IUser[] allUsers = await GetAllUsers();
    return allUsers.Where(u => userIds.Contains(u.Id)).ToArray();
  }

  public Task<IUser[]> GetAllUsers()
  {
    return Task.FromResult(Users.Select(u => u.Copy()).ToArray());
  }

  public Task<IJournal[]> GetAllJournals(string? searchText = null, JournalType[]? journalTypes = null, int? limit = null)
  {
    // note: conditions are currently ignored, as they are not (yet?) needed for these in memory tests.
    return Task.FromResult(Journals.ToArray());
  }

  public Task<IJournal?> GetJournal(string journalId)
  {
    return Task.FromResult(Journals.FirstOrDefault(m => m.Id == journalId).Copy());
  }

  public Task<IMeasurement[]> GetAllMeasurements(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  )
  {
    return Task.FromResult(
      Measurements.Where(m => m.ParentId == journalId)
        .Select(m => m.Copy())
        .ToArray()
    );
  }

  public Task<IMeasurement[]> GetLastEditedMeasurements(
    string[]? journalIds,
    string? searchText,
    JournalType[]? metricTypes,
    int limit
  )
  {
    return Task.FromResult(
      Measurements.OrderByDescending(m => m.DateTime)
        .Where(m => (journalIds ?? Enumerable.Empty<string>()).Contains(m.ParentId))
        .Take(limit)
        .ToArray()
    );
  }

  public Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    if (string.IsNullOrEmpty(journal.Id))
    {
      journal.Id = GenerateId();
    }
    else
    {
      RemoveJournal(journal);
    }

    Journals.Add(journal.Copy());

    return Task.FromResult(new UpsertResult { EntityId = journal.Id });
  }

  public async Task DeleteJournal(string journalId)
  {
    if (string.IsNullOrEmpty(journalId))
    {
      return;
    }

    IJournal? metric = await GetJournal(journalId);
    if (metric == null)
    {
      return;
    }

    Journals.Remove(metric);
  }

  public async Task ModifyJournalPermissions(string metricId, Dictionary<string, PermissionKind> permissions)
  {
    IJournal? metric = await GetJournal(metricId);
    if (metric == null)
    {
      return;
    }

    var permissionsEnsurer = new PermissionsEnsurer(this, UpsertUser);
    await permissionsEnsurer.EnsurePermissions(metric, permissions);

    await UpsertJournal(metric);
  }

  public async Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement)
    where TMeasurement : IMeasurement
  {
    if (string.IsNullOrEmpty(measurement.Id))
    {
      measurement.Id = GenerateId();
    }
    else
    {
      await DeleteMeasurement(measurement.Id);
    }

    Measurements.Add(measurement.Copy());

    return new UpsertResult { EntityId = measurement.Id };
  }

  public async Task DeleteMeasurement(string measurementId)
  {
    if (string.IsNullOrEmpty(measurementId))
    {
      return;
    }

    IMeasurement? measurement = await GetMeasurement(measurementId);
    if (measurement == null)
    {
      return;
    }

    Measurements.Remove(measurement);
  }

  public Task<IMeasurement?> GetMeasurement(string measurementId)
  {
    return Task.FromResult(Measurements.FirstOrDefault(m => m.Id == measurementId));
  }

  public Task WakeMeUp()
  {
    return Task.CompletedTask;
  }

  public Task<IMeasurement[]> SearchMeasurements(string searchText)
  {
    throw new NotImplementedException();
  }

  private void RemoveJournal<TJournal>(TJournal journal) where TJournal : IJournal
  {
    if (string.IsNullOrEmpty(journal.Id))
    {
      return;
    }

    IJournal? firstOrDefault = Journals.FirstOrDefault(j => j.Id == journal.Id);
    if (firstOrDefault == null)
    {
      return;
    }

    Journals.Remove(firstOrDefault);
  }

  private void RemoveUser(IUser user)
  {
    if (string.IsNullOrEmpty(user.Name))
    {
      return;
    }

    IUser? firstOrDefault = Users.FirstOrDefault(m => m.Name == user.Name);
    if (firstOrDefault == null)
    {
      return;
    }

    Users.Remove(firstOrDefault);
  }

  private static string GenerateId()
  {
    return Guid.NewGuid().ToString("N");
  }
}
