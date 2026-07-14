namespace Engraved.TestUtils;

/// <summary>
///   Shared, valid 24-character hex ObjectId strings used across the test suites.
///   EphemeralMongo (unlike the former in-memory repository) requires ids to be parseable
///   as <see cref="MongoDB.Bson.ObjectId" />, so tests cannot use arbitrary strings like "journal_id".
///   Keeping the recurring ids here avoids duplicating the same literal in many test files.
/// </summary>
public static class TestIds
{
  /// <summary>The primary user that owns the entities under test.</summary>
  public const string UserId = "6a40b7027bf30b7c135049b4";

  /// <summary>A second user, e.g. one that entities are shared with.</summary>
  public const string OtherUserId = "6a40b7027bf30b7c135049b3";

  /// <summary>A third user, used where three distinct users are needed.</summary>
  public const string ThirdUserId = "6a40b7027bf30b7c135049b2";
}
