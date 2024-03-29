﻿using Engraved.Core.Application;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public class TestUserScopedMongoRepository(
  MongoDatabaseClient mongoDatabaseClient,
  ICurrentUserService currentUserService
)
  : UserScopedMongoRepository(mongoDatabaseClient, currentUserService)
{
  public IMongoCollection<JournalDocument> Journals => JournalsCollection;
  public IMongoCollection<EntryDocument> Entries => EntriesCollection;
  public IMongoCollection<UserDocument> Users => UsersCollection;
}
