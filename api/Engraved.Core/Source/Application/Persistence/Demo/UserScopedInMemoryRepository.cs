using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;
using Engraved.Core.Domain.Permissions;
using Engraved.Core.Domain.User;

namespace Engraved.Core.Application.Persistence.Demo;

public class UserScopedInMemoryRepository : IUserScopedRepository
{
  private readonly IRepository _repository;
  private readonly ICurrentUserService _currentUserService;

  public Lazy<IUser> CurrentUser { get; }

  public UserScopedInMemoryRepository(IRepository repository, ICurrentUserService currentUserService)
  {
    _repository = repository;
    _currentUserService = currentUserService;
    CurrentUser = new Lazy<IUser>(LoadUser);
  }

  public Task<IUser?> GetUser(string name)
  {
    return _repository.GetUser(name);
  }

  public Task<UpsertResult> UpsertUser(IUser user)
  {
    return _repository.UpsertUser(user);
  }

  public Task<IUser[]> GetUsers(string[] userIds)
  {
    return _repository.GetAllUsers();
  }

  public async Task<IUser[]> GetAllUsers()
  {
    return (await _repository.GetAllUsers())
      .Where(u => u.Id == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IJournal[]> GetAllJournals(string? searchText, JournalType[]? journalTypes = null, int? limit = null)
  {
    IJournal[] allJournals = await _repository.GetAllJournals(searchText, journalTypes, limit);
    return allJournals
      .Where(j => j.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public async Task<IJournal?> GetJournal(string journalId)
  {
    IJournal? journal = await _repository.GetJournal(journalId);
    return journal?.UserId == CurrentUser.Value.Id ? journal : null;
  }

  public async Task<IMeasurement[]> GetAllMeasurements(
    string journalId,
    DateTime? fromDate,
    DateTime? toDate,
    IDictionary<string, string[]>? attributeValues
  )
  {
    return (await _repository.GetAllMeasurements(journalId, fromDate, toDate, attributeValues))
      .Where(m => m.UserId == CurrentUser.Value.Id)
      .ToArray();
  }

  public Task<IMeasurement[]> GetLastEditedMeasurements(
    string[]? journalIds,
    string? searchText,
    JournalType[]? journalTypes,
    int limit
  )
  {
    return _repository.GetLastEditedMeasurements(journalIds, searchText, journalTypes, limit);
  }

  public Task<UpsertResult> UpsertJournal(IJournal journal)
  {
    journal.UserId = CurrentUser.Value.Id;
    return _repository.UpsertJournal(journal);
  }

  public async Task DeleteJournal(string journalId)
  {
    // get journal only returns if journal belongs to current user
    IJournal? journal = await GetJournal(journalId);

    if (journal == null)
    {
      return;
    }

    await _repository.DeleteJournal(journalId);
  }

  public async Task ModifyJournalPermissions(string journalId, Dictionary<string, PermissionKind> permissions)
  {
    IJournal? journal = await GetJournal(journalId);
    if (journal == null)
    {
      throw new Exception("Does not exist or no access");
    }

    await _repository.ModifyJournalPermissions(journalId, permissions);
  }

  public Task<UpsertResult> UpsertMeasurement<TMeasurement>(TMeasurement measurement) where TMeasurement : IMeasurement
  {
    measurement.UserId = CurrentUser.Value.Id;
    return _repository.UpsertMeasurement(measurement);
  }

  public async Task DeleteMeasurement(string measurementId)
  {
    // get measurement only returns if measurement belongs to current user
    IMeasurement? measurement = await GetMeasurement(measurementId);

    if (measurement == null)
    {
      return;
    }

    await _repository.DeleteMeasurement(measurementId);
  }

  public async Task<IMeasurement?> GetMeasurement(string measurementId)
  {
    IMeasurement? measurement = await _repository.GetMeasurement(measurementId);

    return measurement != null && measurement.UserId == CurrentUser.Value.Id
      ? measurement
      : null;
  }

  public Task WakeMeUp()
  {
    return Task.CompletedTask;
  }

  private IUser LoadUser()
  {
    string? name = _currentUserService.GetUserName();
    EnsureUserNameIsSet(name);

    IUser? result = _repository.GetUser(name!).Result;
    if (result == null)
    {
      throw new NotAllowedOperationException($"Current user '{name}' does not exist.");
    }

    return result;
  }

  private static void EnsureUserNameIsSet(string? name)
  {
    if (string.IsNullOrEmpty(name))
    {
      throw new NotAllowedOperationException($"Current user is not available.");
    }
  }
}
