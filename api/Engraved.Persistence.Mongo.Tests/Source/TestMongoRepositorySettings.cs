﻿namespace Engraved.Persistence.Mongo.Tests;

public class TestMongoRepositorySettings : IMongoRepositorySettings
{
  public string MongoDbConnectionString => "mongodb://127.0.0.1:27017";
  public string DatabaseName => "metrix_unit_test";
  public string JournalsCollectionName => "journals";
  public string EntriesCollectionName => "entries";
  public string UsersCollectionName => "users";
}
