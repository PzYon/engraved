﻿using MongoDB.Bson;

namespace Engraved.Persistence.Mongo.DocumentTypes;

public interface IDocument
{
  public ObjectId Id { get; set; }
}
