using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Repositories;

// Plain user data access with no guards. Callers that must enforce ownership do so on top of this
// (see UserRestrictedMongoRepository.UpsertUser); internal consumers like PermissionsEnsurer use it
// directly because they legitimately operate on other users' records.
public class MongoUserRepository(MongoDatabaseClient mongoDatabaseClient) : IUserRepository
{
  private IMongoCollection<UserDocument> UsersCollection => mongoDatabaseClient.UsersCollection;

  public async Task<IUser?> GetUser(string? nameOrId)
  {
    if (string.IsNullOrEmpty(nameOrId))
    {
      throw new ArgumentNullException(nameof(nameOrId), "Username or ID must be specified.");
    }

    var filterDefinition = ObjectId.TryParse(nameOrId, out ObjectId id)
      ? Builders<UserDocument>.Filter.Where(d => d.Id == id)
      : Builders<UserDocument>.Filter.Where(d => d.Name == nameOrId);

    UserDocument? document = await UsersCollection
      .Find(filterDefinition)
      .FirstOrDefaultAsync();

    return UserDocumentMapper.FromDocument(document);
  }

  public async Task<UpsertResult> UpsertUser(IUser user)
  {
    UserDocument document = UserDocumentMapper.ToDocument(user);

    IUser? existingUser = await GetUser(user.Name);
    if (existingUser != null && string.IsNullOrEmpty(user.Id))
    {
      throw new ArgumentException("ID must be specified for existing users.");
    }

    ReplaceOneResult? replaceOneResult = await UsersCollection.ReplaceOneAsync(
      Builders<UserDocument>.Filter.Where(d => d.Name == user.Name),
      document,
      new ReplaceOptions { IsUpsert = true }
    );

    return MongoUtil.CreateUpsertResult(user.Id, replaceOneResult);
  }

  public async Task<IUser[]> GetUsers(params string[] userIds)
  {
    if (userIds.Length == 0)
    {
      return [];
    }

    var users = await UsersCollection
      .Find(Builders<UserDocument>.Filter.Or(userIds.Distinct().Select(MongoUtil.GetDocumentByIdFilter<UserDocument>)))
      .ToListAsync();

    return users.Select(u => UserDocumentMapper.FromDocument(u)!).ToArray();
  }

  public async Task<IUser[]> GetAllUsers()
  {
    var users = await UsersCollection
      .Find(MongoUtil.GetAllDocumentsFilter<UserDocument>())
      .ToListAsync();

    return users.Select(u => UserDocumentMapper.FromDocument(u)!).ToArray();
  }
}
