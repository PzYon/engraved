using System.Security.Claims;
using System.Text;
using Engraved.Api.Authentication;
using Engraved.Api.Authentication.Basic;
using Engraved.Api.Settings;
using Engraved.Core.Application;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Engraved.Api.Bootstrap;

public static class AuthenticationRegistration
{
  public static void RegisterAuthentication(
    IServiceCollection services,
    IConfigurationSection authConfigSection,
    bool isE2ETests
  )
  {
    if (isE2ETests)
    {
      services.AddAuthentication("BasicAuthentication")
        .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);
      return;
    }

    services.AddAuthentication(options =>
        {
          options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }
      )
      .AddJwtBearer(options =>
        {
          options.RequireHttpsMetadata = false;
          options.SaveToken = true;
          options.TokenValidationParameters = new TokenValidationParameters
          {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(GetJwtSecret(authConfigSection))),
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
          };
          options.Events = new JwtBearerEvents { OnTokenValidated = OnTokenValidated };
        }
      );
  }

  private static Task OnTokenValidated(TokenValidatedContext context)
  {
    var jwtToken = (JsonWebToken) context.SecurityToken;
    Claim? nameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid");
    if (nameClaim == null)
    {
      // a validly-signed token without a "nameid" claim should never happen for tokens we issue
      // ourselves (JwtTokenFactory always adds it), but failing the handshake here turns a
      // malformed/foreign token into a clean 401 instead of an unhandled exception.
      context.Fail("Token does not contain a \"nameid\" claim.");
      return Task.CompletedTask;
    }

    context.HttpContext.RequestServices
      .GetRequiredService<ICurrentUserService>()
      .SetUserName(nameClaim.Value);

    return Task.CompletedTask;
  }

  private static string GetJwtSecret(IConfigurationSection configurationSection)
  {
    var jwtSecret = configurationSection.GetValue<string>(nameof(AuthenticationConfig.JwtSecret));
    if (string.IsNullOrEmpty(jwtSecret))
    {
      throw new Exception("App Service Config: No JWT Secret available.");
    }

    return jwtSecret;
  }
}
