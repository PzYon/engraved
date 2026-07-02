using Engraved.TestUtils;
using NUnit.Framework;

// Assembly-level teardown: NUnit runs this once after every test in the assembly has finished.
// It stops the shared EphemeralMongo instance so its ~280 MB temp data directory is deleted
// instead of lingering. A [SetUpFixture] in the global namespace applies to the whole assembly.
//
// This file is compiled into every test assembly that uses Util (linked via the .csproj of the
// referencing test projects), because NUnit only discovers SetUpFixtures in the assembly under
// test - not in referenced assemblies.
[SetUpFixture]
public class MongoRunnerTeardown
{
  [OneTimeTearDown]
  public void StopRunner()
  {
    Util.StopRunner();
  }
}
