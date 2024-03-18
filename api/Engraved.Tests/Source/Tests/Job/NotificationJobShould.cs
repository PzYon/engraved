using Engraved.Core.Application;
using Engraved.Core.Application.Jobs;
using Engraved.Tests.Utils;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;

namespace Engraved.Tests.Tests.Job;

public class NotificationJobShould
{
  private const string UserName = "boss";

  private FakeDateService _dateService = null!;
  private EngravedTestContext _testContext = null!;

  private NotificationJob _job = null!;

  [SetUp]
  public async Task Setup()
  {
    _dateService = new FakeDateService();

    _testContext = await EngravedTestContext.CreateForUser(_dateService, UserName);

    _job = new NotificationJob(
      NullLogger<NotificationJob>.Instance,
      _testContext.Repo,
      _dateService,
      new TestNotificationService()
    );
  }

  [Test]
  public async Task Process_Journal_WithPassedNextOccurrence()
  {
    string journalId = await _testContext.AddJournal(nextOccurrence: _dateService.UtcNow.AddDays(-1));

    NotificationJobResult result = await _job.Execute(false);

    result.ProcessedJournalIds.Should().Contain(journalId);
  }

  [Test]
  public async Task NotProcess_Journal_WithUpcomingNextOccurrence()
  {
    await _testContext.AddJournal(nextOccurrence: _dateService.UtcNow.AddDays(1));

    NotificationJobResult result = await _job.Execute(false);

    result.ProcessedJournalIds.Should().BeEmpty();
  }

  [Test]
  public async Task NotProcess_Journal_WithNoNextOccurrence()
  {
    await _testContext.AddJournal();

    NotificationJobResult result = await _job.Execute(false);

    result.ProcessedJournalIds.Should().BeEmpty();
  }
}
