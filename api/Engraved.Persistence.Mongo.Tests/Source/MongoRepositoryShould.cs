using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Domain.Entries;
using Engraved.Core.Domain.Journals;
using Engraved.Core.Domain.User;
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
  public async Task GetAllJournals_Empty()
  {
    IJournal[] allJournals = await _repository.GetAllJournals();

    Assert.AreEqual(allJournals.Length, 0);
  }

  [Test]
  public async Task CreateOneJournal_Then_GetJournal()
  {
    UpsertResult result = await _repository.UpsertJournal(new CounterJournal());

    IJournal? journal = await _repository.GetJournal(result.EntityId);

    Assert.IsNotNull(journal);
  }

  [Test]
  public async Task CreateJournals_Then_GetAllJournals()
  {
    await _repository.UpsertJournal(new CounterJournal());
    await _repository.UpsertJournal(new CounterJournal());

    IJournal[] allJournals = await _repository.GetAllJournals();

    Assert.AreEqual(allJournals.Length, 2);
  }

  [Test]
  public async Task CreateJournal_Then_Update()
  {
    var counterJournal = new CounterJournal { Name = "First" };
    UpsertResult result = await _repository.UpsertJournal(counterJournal);

    counterJournal = (CounterJournal?) await _repository.GetJournal(result.EntityId);

    Assert.IsNotNull(counterJournal);

    counterJournal!.Name = "Second";
    await _repository.UpsertJournal(counterJournal);

    IJournal? updateJournal = await _repository.GetJournal(result.EntityId);
    Assert.IsNotNull(updateJournal);
    Assert.AreEqual(counterJournal.Id, updateJournal!.Id);
    Assert.AreEqual(counterJournal.Name, updateJournal.Name);
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
    Assert.IsNotNull(journal);
    Assert.IsNotNull(journal!.Attributes);

    Assert.Contains("flags", journal.Attributes.Keys);
    JournalAttribute attribute = journal.Attributes["flags"];
    Assert.Contains("fl@g", attribute.Values.Keys);
    Assert.AreEqual("fl@g_value", attribute.Values["fl@g"]);
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

    Assert.AreEqual(2, allEntries.Length);
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

    Assert.IsTrue(reloadedJournal.CustomProps.ContainsKey("uiSettings"));
    Assert.AreEqual(reloadedJournal.CustomProps["uiSettings"], value);
  }
}
