using System.Linq;
using Metrix.Core.Application.Commands.Measurements.Add;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Metrix.Core.Domain.Measurements;

[TestClass]
public class MeasurementsStoreShould
{
  private const string metricKey = "m3tr1k3y";
  private const string notesIdentifier = "foo-bar";

  private IMeasurementsStore store;

  [TestInitialize]
  public void SetUp()
  {
    store = new MeasurementsStore();
  }

  // USE CASE:
  // Measure when a migraine medicine was taken. Requirements are:
  // - Date time
  // - Shape (Ausprägung), e.g. Irfen oder Aimovig

  [TestMethod]
  public void AddMeasurement_IsLinkedWithMetric()
  {
    store.AddMeasurement(new AddMeasurementCommand
    {
      MetricKey = metricKey,
      Notes = notesIdentifier
    });

    var m = store.GetMeasurements(metricKey).FirstOrDefault(m => m.Notes == notesIdentifier);
    Assert.IsNotNull(m);
    Assert.AreEqual(metricKey, m.MetricKey);
  }

  [TestMethod]
  public void AddMeasurement_WithCurrentDateTime()
  {
    var command = new AddMeasurementCommand
    {
      MetricKey = metricKey,
      Notes = notesIdentifier
    };

    store.AddMeasurement(command);

    var m = store.GetMeasurements(metricKey).FirstOrDefault(m => m.Notes == notesIdentifier);
    Assert.IsNotNull(m);
    Assert.AreEqual(command.DateTime, m.DateTime);
  }
}
