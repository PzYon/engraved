using Engraved.Api.Authentication;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Users.UpdateTags;
using Engraved.Core.Domain.Journals;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

/// <summary>
/// Endpoint to seed an entire test scenario (journals + entries) in a single
/// call. It is a thin batching facade over the very same command handlers the
/// real controllers use, so seeded data is identical to data created through
/// the UI. Only active in e2e-test mode - returns 404 otherwise.
/// </summary>
[ApiController]
[Route("api/test")]
[Authorize]
public class TestDataController(
  Dispatcher dispatcher,
  ILoginHandler loginHandler,
  ICurrentUserService currentUserService,
  E2ETestMode testMode
) : ControllerBase
{
  [HttpPost("seed")]
  public async Task<ActionResult<SeedResult>> Seed([FromBody] SeedTestDataDto dto)
  {
    if (!testMode.IsEnabled)
    {
      return NotFound();
    }

    // Ensure the user exists before dispatching commands - the user is not
    // auto-created on first command (UserLoader throws for unknown users).
    // This is the same path the app's e2e login uses.
    await loginHandler.LoginForTests(currentUserService.GetUserName());

    var seededJournals = new List<SeededJournal>();

    foreach (SeedJournalDto journalDto in dto.Journals)
    {
      string journalId = (await dispatcher.Command(
        new AddJournalCommand
        {
          Name = journalDto.Name,
          Description = journalDto.Description,
          Type = journalDto.Type
        }
      )).EntityId;

      var entryIds = new List<string>();
      foreach (SeedEntryDto entryDto in journalDto.Entries)
      {
        CommandResult result = await DispatchEntryCommand(journalId, journalDto.Type, entryDto);
        entryIds.Add(result.EntityId);
      }

      seededJournals.Add(new SeededJournal { JournalId = journalId, EntryIds = entryIds.ToArray() });
    }

    if (dto.Tags.Length > 0)
    {
      await dispatcher.Command(
        new UpdateUserTagsCommand
        {
          TagNames = dto.Tags.ToDictionary(tag => tag.Id, tag => tag.Label)
        }
      );
    }

    return new SeedResult { Journals = seededJournals.ToArray() };
  }

  private async Task<CommandResult> DispatchEntryCommand(string journalId, JournalType type, SeedEntryDto entry)
  {
    // Dispatch with the concrete command type so the right executor resolves.
    return type switch
    {
      JournalType.Gauge => await dispatcher.Command(
        new UpsertGaugeEntryCommand { JournalId = journalId, Value = entry.Value, Notes = entry.Notes }
      ),
      JournalType.Counter => await dispatcher.Command(
        new UpsertCounterEntryCommand { JournalId = journalId, Notes = entry.Notes }
      ),
      JournalType.Scraps => await dispatcher.Command(
        new UpsertScrapsEntryCommand { JournalId = journalId, Title = entry.Title ?? "", Notes = entry.Notes }
      ),
      _ => throw new InvalidOperationException(
        $"Seeding entries for journal type '{type}' is not supported yet."
      )
    };
  }
}

public class SeedTestDataDto
{
  public SeedJournalDto[] Journals { get; set; } = [];

  public SeedTagDto[] Tags { get; set; } = [];
}

public class SeedTagDto
{
  public string Id { get; set; } = null!;

  public string Label { get; set; } = null!;
}

public class SeedJournalDto
{
  public string Name { get; set; } = null!;

  public string? Description { get; set; }

  public JournalType Type { get; set; }

  public SeedEntryDto[] Entries { get; set; } = [];
}

public class SeedEntryDto
{
  public double? Value { get; set; }

  public string? Title { get; set; }

  public string? Notes { get; set; }
}

public class SeedResult
{
  public SeededJournal[] Journals { get; set; } = [];
}

public class SeededJournal
{
  public string JournalId { get; set; } = null!;

  public string[] EntryIds { get; set; } = [];
}
