using Microsoft.Extensions.Hosting;

namespace Engraved.Api.Settings;

/// <summary>
/// Flag indicating whether the API was started in e2e-test mode (i.e. with the
/// "e2e-tests" command line argument). Registered as a singleton so endpoints
/// that must only exist for e2e tests (e.g. the test-data seeding endpoint) can
/// hard-guard themselves and stay inert in production.
/// </summary>
public class E2ETestMode(bool isEnabled)
{
  private const string CommandLineArgument = "e2e-tests";

  public bool IsEnabled { get; } = isEnabled;

  // e2e mode swaps JWT for basic auth, which accepts any user name without a password. A stray
  // argument must therefore never be able to switch a production deployment into it.
  public static bool IsRequested(IEnumerable<string> commandLineArgs, IHostEnvironment environment)
  {
    if (!commandLineArgs.Contains(CommandLineArgument))
    {
      return false;
    }

    if (environment.IsProduction())
    {
      throw new InvalidOperationException(
        $"The \"{CommandLineArgument}\" argument is not allowed in the {Environments.Production} environment. "
        + "Start the API with a different environment (e.g. \"--environment E2ETests\") to run e2e tests."
      );
    }

    return true;
  }
}
