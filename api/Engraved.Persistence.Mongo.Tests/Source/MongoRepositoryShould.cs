using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.Users;
using FluentAssertions;
using Newtonsoft.Json;
using NUnit.Framework;

namespace Engraved.Persistence.Mongo.Tests;

// consider using Commands and Queries here to improve data consistency and 
// have a more end-to-end view, e.g. something like this:
// await new AddCounterEntryCommand().CreateExecutor().Execute(_repository, null);

public class MongoRepositoryShould
{
  private MongoRepository _repository = null!;

  [SetUp]
  public async Task Setup()
  {
    _repository = await Util.CreateMongoRepository();
  }

  [Test]
  public async Task CreateOneJournal_Then_GetJournal()
  {
    UpsertResult result = await _repository.UpsertJournal(new CounterJournal());

    IJournal? journal = await _repository.GetJournal(result.EntityId);

    journal.Should().NotBeNull();
  }

  [Test]
  public async Task CreateJournal_Then_Update()
  {
    var counterJournal = new CounterJournal { Name = "First" };
    UpsertResult result = await _repository.UpsertJournal(counterJournal);

    counterJournal = (CounterJournal?) await _repository.GetJournal(result.EntityId);

    counterJournal.Should().NotBeNull();

    counterJournal!.Name = "Second";
    await _repository.UpsertJournal(counterJournal);

    IJournal? updateJournal = await _repository.GetJournal(result.EntityId);
    updateJournal.Should().NotBeNull();
    updateJournal!.Id.Should().Be(counterJournal.Id);
    updateJournal.Name.Should().Be(counterJournal.Name);
  }

  [Test]
  public async Task CreateJournal_WithAttributes()
  {
    var counterJournal = new CounterJournal
    {
      Name = "First",
      Attributes = new Dictionary<string, JournalAttribute>
      {
        {
          "flags",
          new JournalAttribute
          {
            Name = "Random Values",
            Values = { { "fl@g", "fl@g_value" } }
          }
        }
      }
    };

    UpsertResult result = await _repository.UpsertJournal(counterJournal);

    IJournal? journal = await _repository.GetJournal(result.EntityId);
    journal.Should().NotBeNull();
    journal!.Attributes.Should().NotBeNull();

    journal.Attributes.Should().ContainKey("flags");
    JournalAttribute attribute = journal.Attributes["flags"];
    attribute.Values.Should().ContainKey("fl@g");
    attribute.Values["fl@g"].Should().Be("fl@g_value");
  }

  [Test]
  public async Task CreateEntries_Then_GetAll()
  {
    var journal = new GaugeJournal { Name = "N@me" };
    UpsertResult result = await _repository.UpsertJournal(journal);

    await _repository.UpsertEntry(new GaugeEntry { ParentId = result.EntityId, Value = 123 });
    await _repository.UpsertEntry(new GaugeEntry { ParentId = "wrongId", Value = 456 });
    await _repository.UpsertEntry(new GaugeEntry { ParentId = result.EntityId, Value = 789 });

    IEntry[] allEntries = await _repository.GetAllEntries(result.EntityId, null, null, null);

    allEntries.Length.Should().Be(2);
  }

  [Test]
  public async Task Not_CreateUser_WithSameName()
  {
    await _repository.UpsertUser(new User { Name = "schorsch" });

    Assert.ThrowsAsync<ArgumentException>(
      async () => await _repository.UpsertUser(new User { Name = "schorsch" })
    );
  }

  [Test]
  public async Task Persist_UiSettings()
  {
    string value = JsonConvert.SerializeObject(new Dictionary<string, object> { { "simpleSetting", true } });

    var journal = new GaugeJournal
    {
      Name = "N@me",
      CustomProps = new Dictionary<string, string> { { "uiSettings", value } }
    };

    UpsertResult result = await _repository.UpsertJournal(journal);
    IJournal reloadedJournal = (await _repository.GetJournal(result.EntityId))!;

    reloadedJournal.CustomProps.Should().ContainKey("uiSettings");
    reloadedJournal.CustomProps["uiSettings"].Should().Be(value);
  }
}
