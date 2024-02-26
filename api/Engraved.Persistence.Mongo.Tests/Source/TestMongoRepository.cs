﻿using Engraved.Core.Application.Persistence;
using Engraved.Persistence.Mongo.DocumentTypes.Entries;
using Engraved.Persistence.Mongo.DocumentTypes.Journals;
using Engraved.Persistence.Mongo.DocumentTypes.Users;
using MongoDB.Driver;

namespace Engraved.Persistence.Mongo.Tests;

public class TestMongoRepository : MongoRepository, IRepository
{
  public IMongoCollection<JournalDocument> Journals => JournalsCollection;
  public IMongoCollection<EntryDocument> Entries => EntriesCollection;
  public IMongoCollection<UserDocument> Users => UsersCollection;

  public TestMongoRepository(IMongoRepositorySettings settings) : base(null, settings, null) { }
}
