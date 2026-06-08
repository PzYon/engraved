namespace Engraved.Api.Settings;

/// <summary>
/// Flag indicating whether the API was started in e2e-test mode (i.e. with the
/// "e2e-tests" command line argument). Registered as a singleton so endpoints
/// that must only exist for e2e tests (e.g. the test-data seeding endpoint) can
/// hard-guard themselves and stay inert in production.
/// </summary>
public class E2ETestMode(bool isEnabled)
{
  public bool IsEnabled { get; } = isEnabled;
}
