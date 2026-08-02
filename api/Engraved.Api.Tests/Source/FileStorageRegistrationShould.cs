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

  // Outside development that same missing secret is a real misconfiguration and has to be loud. The
  // storage settings are given explicitly so that this fails over the secret and not over the
  // storage configuration, which is missing here too and is checked first.
  [Test]
  public void Throw_When_NoJwtSecretIsConfigured_OutsideDevelopment()
  {
    Action register = () => Resolve<IFileIdFactory>(false, DevelopmentStorage);

    register.Should().Throw<InvalidOperationException>().WithMessage("*JWT Secret*");
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

  // Registration, not resolution: built lazily, an unusable connection string would first be
  // constructed on an entry upsert and so break saving in an application that started up fine.
  [Test]
  public void Throw_When_TheConnectionStringCannotBeParsed()
  {
    Action register = () => Register(true, ("FileStorage:ConnectionString", "name=value"));

    register.Should().Throw<Exception>();
  }

  // What putting the account URL into the wrong setting looks like. Without this it reaches the
  // storage SDK, which reports it as a malformed connection string without knowing that a perfectly
  // good endpoint was meant.
  [Test]
  public void Throw_When_TheConnectionStringIsAnEndpointUrl()
  {
    Action register = () => Register(
      true,
      ("FileStorage:ConnectionString", "https://engravedfiles.blob.core.windows.net")
    );

    register.Should()
      .Throw<InvalidOperationException>()
      .WithMessage("*FileStorage__BlobEndpoint*");
  }

  // Setting both is always a mistake: the connection string wins and the endpoint is never read, so
  // whoever set it is not getting the managed identity they think they are.
  [Test]
  public void Throw_When_BothCredentialSettingsAreSet()
  {
    Action register = () => Register(
      true,
      DevelopmentStorage,
      ("FileStorage:BlobEndpoint", "https://engravedfiles.blob.core.windows.net")
    );

    register.Should().Throw<InvalidOperationException>().WithMessage("*only one of*");
  }

  [Test]
  public void Throw_When_TheBlobEndpointIsNotAUrl()
  {
    Action register = () => Register(true, ("FileStorage:BlobEndpoint", "engravedfiles"));

    register.Should()
      .Throw<InvalidOperationException>()
      .WithMessage("*FileStorage__BlobEndpoint is not an absolute URL*");
  }

  private static (string Key, string Value) DevelopmentStorage =>
    ("FileStorage:ConnectionString", "UseDevelopmentStorage=true");

  private static T Resolve<T>(bool useDevelopmentDefaults, params (string Key, string Value)[] settings)
    where T : notnull
  {
    return Register(useDevelopmentDefaults, settings).BuildServiceProvider().GetRequiredService<T>();
  }

  private static IServiceCollection Register(
    bool useDevelopmentDefaults,
    params (string Key, string Value)[] settings
  )
  {
    var values = new Dictionary<string, string?> { ["FileStorage:ContainerName"] = "files" };

    foreach ((var key, var value) in settings)
    {
      values[key] = value;
    }

    IConfiguration configuration = new ConfigurationBuilder().AddInMemoryCollection(values).Build();

    var services = new ServiceCollection();

    FileStorageRegistration.RegisterFileStorage(services, configuration, useDevelopmentDefaults);

    return services;
  }
}
