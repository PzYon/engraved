using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Repositories;
using Engraved.Core.Domain.Users;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Repositories;

// Plain user data access with no guards. Callers that must enforce ownership do so on top of this
// (see UserRestrictedUserRepository); internal consumers like PermissionsEnsurer use it directly
// because they legitimately operate on other users' records.
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

    // Sets the fields rather than replacing the whole document, so that the scratchpad, which is
    // only ever written by UpdateScratchpad, survives. Otherwise a user loaded before a scratchpad
    // save and stored after it (e.g. when a refresh token is rotated) would undo that save.
    BsonDocument fields = document.ToBsonDocument();
    fields.Remove("_id");
    fields.Remove(nameof(UserDocument.Scratchpad));

    var update = new BsonDocument("$set", fields);
    if (document.Id != ObjectId.Empty)
    {
      update.Add("$setOnInsert", new BsonDocument("_id", document.Id));
    }

    UpdateResult updateResult = await UsersCollection.UpdateOneAsync(
      Builders<UserDocument>.Filter.Where(d => d.Name == user.Name),
      update,
      new UpdateOptions { IsUpsert = true }
    );

    return MongoUtil.CreateUpsertResult(user.Id, updateResult);
  }

  public async Task<bool> UpdateScratchpad(string userId, UserScratchpad scratchpad, DateTime? lastKnownEditedOn)
  {
    FilterDefinitionBuilder<UserDocument> filter = Builders<UserDocument>.Filter;

    // The conflict check is part of the update's filter rather than a read before it, so that no
    // other save can sneak in between checking and writing.
    FilterDefinition<UserDocument> notEditedSince = lastKnownEditedOn == null
      ? filter.Eq(d => d.Scratchpad, null)
      : filter.Not(filter.Gt(d => d.Scratchpad!.EditedOn, lastKnownEditedOn.Value));

    UpdateResult result = await UsersCollection.UpdateOneAsync(
      filter.And(MongoUtil.GetDocumentByIdFilter<UserDocument>(userId), notEditedSince),
      Builders<UserDocument>.Update.Set(
        d => d.Scratchpad,
        new UserScratchpadDocument
        {
          Content = scratchpad.Content,
          EditedOn = scratchpad.EditedOn
        }
      )
    );

    return result.MatchedCount == 1;
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

  public async Task DeleteUser(string userId)
  {
    await UsersCollection.DeleteOneAsync(MongoUtil.GetDocumentByIdFilter<UserDocument>(userId));
  }
}
