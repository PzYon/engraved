using System;
using System.Collections.Generic;
using Engraved.Api.Bootstrap;
using Engraved.Core.Application.Files;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;

namespace Engraved.Api.Tests;

public class FileStorageRegistrationShould
{
  // e2e runs the published API, so appsettings.Development.json is not loaded, and its auth path is
  // the basic-auth handler which never needs a JWT secret. Nothing therefore configures one - and
  // since every entry upsert now signs file ids, a hard requirement here broke saving any entry at
  // all in e2e while passing every build and startup check.
  [Test]
  public void Fall_BackToADevelopmentSigningKey_When_NoJwtSecretIsConfigured()
  {
    IFileIdFactory factory = Resolve<IFileIdFactory>(useDevelopmentDefaults: true);

    var fileId = factory.Create("some-user");

    factory.BelongsToUser(fileId, "some-user").Should().BeTrue();
  }

  // Outside development that same missing secret is a real misconfiguration and has to be loud.
  [Test]
  public void Throw_When_NoJwtSecretIsConfigured_OutsideDevelopment()
  {
    Action register = () => Resolve<IFileIdFactory>(useDevelopmentDefaults: false);

    register.Should().Throw<InvalidOperationException>();
  }

  [Test]
  public void Use_TheConfiguredJwtSecret_When_ThereIsOne()
  {
    IFileIdFactory configured = Resolve<IFileIdFactory>(
      true,
      ("Authentication:JwtSecret", "a-real-secret")
    );

    // A file id signed with the configured secret must not verify under the development fallback,
    // otherwise the fallback would silently be in use everywhere.
    var fileId = configured.Create("some-user");

    Resolve<IFileIdFactory>(useDevelopmentDefaults: true)
      .BelongsToUser(fileId, "some-user")
      .Should()
      .BeFalse();
  }

  private static T Resolve<T>(bool useDevelopmentDefaults, params (string Key, string Value)[] settings)
    where T : notnull
  {
    var values = new Dictionary<string, string?> { ["FileStorage:ContainerName"] = "files" };

    foreach ((var key, var value) in settings)
    {
      values[key] = value;
    }

    IConfiguration configuration = new ConfigurationBuilder().AddInMemoryCollection(values).Build();

    var services = new ServiceCollection();

    FileStorageRegistration.RegisterFileStorage(services, configuration, useDevelopmentDefaults);

    return services.BuildServiceProvider().GetRequiredService<T>();
  }
}
