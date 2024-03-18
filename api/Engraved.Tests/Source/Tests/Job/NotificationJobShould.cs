using Engraved.Core.Application;
using Engraved.Core.Application.Commands.Journals.AddSchedule;
using Engraved.Core.Application.Jobs;
using Engraved.Persistence.Mongo.Tests;
using Engraved.Tests.Utils;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;

namespace Engraved.Tests.Tests.Job;

public class NotificationJobShould
{
  private const string UserName1 = "jack";
  private const string UserName2 = "jill";

  private FakeDateService _dateService = null!;
  private TestMongoRepository _repo = null!;

  private EngravedTestContext _testContext1 = null!;
  private EngravedTestContext _testContext2 = null!;

  private NotificationJob _job = null!;

  [SetUp]
  public async Task Setup()
  {
    _dateService = new FakeDateService();
    _repo = await Util.CreateMongoRepository();

    _testContext1 = await EngravedTestContext.CreateForUser(_repo, _dateService, UserName1);
    _testContext2 = await EngravedTestContext.CreateForUser(_repo, _dateService, UserName2);

    _job = new NotificationJob(
      NullLogger<NotificationJob>.Instance,
      _repo,
      _dateService,
      new TestNotificationService()
    );
  }

  [Test]
  public async Task NotProcess_OneJournal_WithNoNextOccurrence()
  {
    await _testContext1.AddJournal();

    NotificationJobResult result = await _job.Execute(false);

    result.NotifiedJournalIdsByUser.Should().BeEmpty();
  }

  [Test]
  public async Task NotProcess_OneJournal_WithUpcomingNextOccurrence()
  {
    await _testContext1.AddJournal(nextOccurrence: _dateService.UtcNow.AddDays(1));

    NotificationJobResult result = await _job.Execute(false);

    result.NotifiedJournalIdsByUser.Should().BeEmpty();
  }

  [Test]
  public async Task Process_OneJournal_WithPassedNextOccurrence()
  {
    string journalId = await _testContext1.AddJournal(nextOccurrence: _dateService.UtcNow.AddDays(-1));

    NotificationJobResult result = await _job.Execute(false);

    result.NotifiedJournalIdsByUser.Should().HaveCount(1);
    result.NotifiedJournalIdsByUser.Should().ContainKey(UserName1);
    result.NotifiedJournalIdsByUser[UserName1].Should().Contain(journalId);
  }

  [Test]
  public async Task Process_Journal_WithUpcomingNextOccurrence_MultipleUsers()
  {
    string journalId1 = await _testContext1.AddJournal(nextOccurrence: _dateService.UtcNow.AddDays(-1));
    string journalId2 = await _testContext2.AddJournal(nextOccurrence: _dateService.UtcNow.AddMinutes(-2));

    NotificationJobResult result = await _job.Execute(false);

    result.NotifiedJournalIdsByUser.Should().HaveCount(2);
    result.NotifiedJournalIdsByUser.Should().ContainKey(UserName1);
    result.NotifiedJournalIdsByUser[UserName1].Should().Contain(journalId1);
    result.NotifiedJournalIdsByUser.Should().ContainKey(UserName2);
    result.NotifiedJournalIdsByUser[UserName2].Should().Contain(journalId2);
  }

  [Test]
  public async Task NotProcess_Journal_WithUpcomingNextOccurrence_MultipleUsers()
  {
    string journalId1 = await _testContext1.AddJournal(nextOccurrence: _dateService.UtcNow.AddDays(-1));

    await new AddScheduleToJournalCommandExecutor(_testContext1.UserScopedRepo).Execute(
      new AddScheduleToJournalCommand { JournalId = journalId1, NextOccurrence = _dateService.UtcNow.AddDays(23) }
    );

    NotificationJobResult result = await _job.Execute(false);

    result.NotifiedJournalIdsByUser.Should().HaveCount(1);
    result.NotifiedJournalIdsByUser.Should().ContainKey(UserName1);
    result.NotifiedJournalIdsByUser[UserName1].Should().Contain(journalId1);
  }
}
