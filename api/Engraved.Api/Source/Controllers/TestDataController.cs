using Engraved.Api.Authentication;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Entries.Upsert.Counter;
using Engraved.Core.Application.Commands.Entries.Upsert.Gauge;
using Engraved.Core.Application.Commands.Entries.Upsert.Scraps;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Commands.Journals.Delete;
using Engraved.Core.Application.Commands.Users.UpdateTags;
using Engraved.Core.Application.CurrentUser;
using Engraved.Core.Application.Queries.Journals.GetAll;
using Engraved.Core.Domain.Journals;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

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

    await loginHandler.LoginForTests(currentUserService.GetUserName());

    // Start from a clean slate. Every new user gets an auto-created "Quick Scraps"
    // journal on first login (see LoginHandler.EnsureQuickScraps). Tests seed an
    // exact set of journals and assert on list counts/positions, so remove any
    // pre-existing journals before seeding to keep those assertions deterministic.
    await ClearExistingJournals();

    var seededJournals = new List<SeededJournal>();

    foreach (SeedJournalDto journalDto in dto.Journals)
    {
      CommandResult createJournalResult = await CreateJournal(journalDto);

      var journalId = createJournalResult.EntityId;

      var entryIds = new List<string>();

      foreach (SeedEntryDto entryDto in journalDto.Entries)
      {
        CommandResult createEntryResult = await CreateEntry(journalId, journalDto.Type, entryDto);
        entryIds.Add(createEntryResult.EntityId);
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

  private async Task ClearExistingJournals()
  {
    IJournal[] journals = await dispatcher.Query<IJournal[], GetAllJournalsQuery>(new GetAllJournalsQuery());

    foreach (IJournal journal in journals)
    {
      await dispatcher.Command(new DeleteJournalCommand { JournalId = journal.Id! });
    }
  }

  private async Task<CommandResult> CreateJournal(SeedJournalDto journalDto)
  {
    return await dispatcher.Command(
      new AddJournalCommand
      {
        Name = journalDto.Name,
        Description = journalDto.Description,
        Type = journalDto.Type
      }
    );
  }

  private async Task<CommandResult> CreateEntry(string journalId, JournalType type, SeedEntryDto entry)
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
