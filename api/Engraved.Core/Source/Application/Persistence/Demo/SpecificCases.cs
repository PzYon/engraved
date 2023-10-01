using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Measurements;

namespace Engraved.Core.Application.Persistence.Demo;

public class SpecificCase
{
  public IJournal Journal { get; set; } = null!;

  public List<IMeasurement> Measurements { get; } = new();
}

public static class SpecificCases
{
  public static SpecificCase GetOffByOneEdgeCase()
  {
    return new SpecificCase
    {
      Journal = new CounterJournal
      {
        Name = "Date Edge Case"
      },
      Measurements =
      {
        new CounterMeasurement
        {
          DateTime = new DateTime(2022, 3, 31, 21, 23, 0, DateTimeKind.Utc)
        },
        new CounterMeasurement
        {
          DateTime = new DateTime(2022, 4, 1, 2, 1, 0, DateTimeKind.Utc)
        }
      }
    };
  }

  public static SpecificCase GetMigraineMedicineCase()
  {
    const string irfenKey = "irf";
    const string eletriptanKey = "ele";
    const string imigranKey = "imi";

    return new SpecificCase
    {
      Journal = new CounterJournal
      {
        Name = "Migraine Medicine",
        Description = "How many migraine medicines have been taken.",
        Attributes = new Dictionary<string, JournalAttribute>
        {
          {
            "medicine",
            new JournalAttribute
            {
              Name = "Medicine Type",
              Values =
              {
                { irfenKey, "Irfen" },
                { eletriptanKey, "Eletriptan" },
                { imigranKey, "Imigran" }
              }
            }
          }
        }
      },
      Measurements =
      {
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { irfenKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { imigranKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-30),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-28),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { irfenKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-10),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-5),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { eletriptanKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-3),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { imigranKey } } }
        },
        new CounterMeasurement
        {
          DateTime = DateTime.UtcNow.AddDays(-3),
          JournalAttributeValues = new Dictionary<string, string[]> { { "medicine", new[] { irfenKey } } }
        }
      }
    };
  }
}
