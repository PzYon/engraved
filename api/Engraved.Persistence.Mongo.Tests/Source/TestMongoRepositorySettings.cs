﻿namespace Engraved.Persistence.Mongo.Tests;

public class TestMongoRepositorySettings : IMongoRepositorySettings
{
  public string MongoDbConnectionString => "mongodb://localhost:27017";
  public string DatabaseName => "metrix_unit_test";
  public string JournalsCollectionName => "metrics";
  public string MeasurementsCollectionName => "measurements";
  public string UsersCollectionName => "users";
}
