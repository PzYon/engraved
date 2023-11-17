using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Persistence.Demo;
using Engraved.Core.Application.Queries.Journals.GetThresholdValues;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
using NUnit.Framework;

namespace Engraved.Core.Application.Queries.Journals;

public class GetThresholdValuesQueryExecutorShould
{
  private const string JournalId = "journal-id";

  private InMemoryRepository _testRepository = null!;
  private UserScopedInMemoryRepository _userScopedInMemoryRepository = null!;
  private string _userId = null!;
  
  [SetUp]
  public async Task SetUp()
  {
    _testRepository = new InMemoryRepository();

    UpsertResult upsertResult = await _testRepository.UpsertUser(new User { Name = "max" });
    _userId = upsertResult.EntityId;

    _userScopedInMemoryRepository = new UserScopedInMemoryRepository(
      _testRepository,
      new FakeCurrentUserService("max")
    );
  }

  [Test]
  public async Task DoSomething()
  {
    _testRepository.Journals.Add(
      new GaugeJournal
      {
        UserId = _userId,
        Id = JournalId,
        Attributes = new Dictionary<string, JournalAttribute>
        {
          {
            "colors",
            new JournalAttribute
            {
              Name = "Colors",
              Values = new Dictionary<string, string> { { "blue", "Blue" }, { "green", "Green" } }
            }
          }
        },
        Thresholds = new Dictionary<string, Dictionary<string, double>>
        {
          { "colors", new Dictionary<string, double> { { "green", 3 }, { "blue", 6 } } }
        }
      }
    );

    AddEntry(2, "blue");
    AddEntry(5, "blue");
    AddEntry(4, "green");
    AddEntry(3, "blue");

    var query = new GetThresholdValuesQuery
    {
      FromDate = DateTime.UtcNow.AddHours(-1),
      ToDate = DateTime.UtcNow.AddHours(1),
      JournalId = JournalId
    };

    IDictionary<string, IDictionary<string, ThresholdResult>> results =
      await new GetThresholdValuesQueryExecutor(_userScopedInMemoryRepository).Execute(query);

    Assert.NotNull(results);

    Assert.That(results.ContainsKey("colors"));
    IDictionary<string, ThresholdResult> colorsThresholds = results["colors"];
    Assert.NotNull(colorsThresholds);

    Assert.AreEqual(2, colorsThresholds.Count);
    Assert.That(colorsThresholds.ContainsKey("blue"));
    Assert.AreEqual(10, colorsThresholds["blue"].ActualValue);
    Assert.AreEqual(6, colorsThresholds["blue"].ThresholdValue);

    Assert.That(colorsThresholds.ContainsKey("green"));
    Assert.AreEqual(4, colorsThresholds["green"].ActualValue);
    Assert.AreEqual(3, colorsThresholds["green"].ThresholdValue);
  }

  private void AddEntry(int value, string attributeValueKey)
  {
    _testRepository.Entries.Add(
      new GaugeEntry
      {
        UserId = _userId,
        ParentId = JournalId,
        DateTime = DateTime.UtcNow,
        Value = value,
        JournalAttributeValues = new Dictionary<string, string[]>
        {
          { "colors", new[] { attributeValueKey } }
        }
      }
    );
  }
}
