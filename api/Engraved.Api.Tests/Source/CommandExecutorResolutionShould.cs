using System;
using System.Collections.Generic;
using System.Linq;
using Engraved.Core.Application.Commands;
using Engraved.TestUtils;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using NUnit.Framework;

namespace Engraved.Api.Tests;

// Booting the application proves the container can be built, not that anything in it can actually be
// constructed: a factory registration that throws does not run until something first asks for it.
// That gap let a missing configuration value pass every build and every startup check, and then fail
// at runtime the first time an entry was saved.
//
// So this resolves every registered command executor rather than trusting that startup succeeded.
// The configuration-specific half of that bug is pinned separately in FileStorageRegistrationShould,
// because the environment e2e runs in is selected by a command-line argument this test cannot set.
public class CommandExecutorResolutionShould
{
  private WebApplicationFactory<Program> _factory = null!;

  [SetUp]
  public void SetUp()
  {
    _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
      {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, config) =>
          {
            config.AddInMemoryCollection(
              new Dictionary<string, string?>
              {
                ["ConnectionStrings:engraved_db"] = Util.ConnectionString,
                ["Authentication:JwtSecret"] = "resolution-test-secret-long-enough-0123456789"
              }
            );
          }
        );

        builder.ConfigureServices(services => services.RemoveAll<IHostedService>());
      }
    );
  }

  [TearDown]
  public void TearDown()
  {
    _factory.Dispose();
  }

  [Test]
  public void Resolve_EveryRegisteredCommandExecutor()
  {
    using IServiceScope scope = _factory.Services.CreateScope();

    Type[] executorTypes = typeof(ICommandExecutor<>).Assembly.GetTypes()
      .Where(t => t is { IsAbstract: false, IsGenericTypeDefinition: false })
      .SelectMany(t => t.GetInterfaces())
      .Where(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(ICommandExecutor<>))
      .Distinct()
      .ToArray();

    executorTypes.Should().NotBeEmpty();

    foreach (Type executorType in executorTypes)
    {
      Action resolve = () => scope.ServiceProvider.GetRequiredService(executorType);

      resolve.Should().NotThrow($"{executorType.GenericTypeArguments[0].Name} must be executable");
    }
  }
}
