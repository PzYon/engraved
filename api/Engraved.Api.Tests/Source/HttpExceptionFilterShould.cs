using System;
using System.Collections.Generic;
using Engraved.Api.Authentication.Google;
using Engraved.Api.Filters;
using Engraved.Core.Application.Commands;
using Engraved.Core.Application.Commands.Journals.Add;
using Engraved.Core.Application.Persistence;
using Engraved.Core.Application.Queries;
using Engraved.Core.Application.Queries.Journals.Get;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using NUnit.Framework;

namespace Engraved.Api.Tests;

// Pins the exception-to-status-code mapping: without it, every failure surfaces as a 500,
// hiding validation errors (400), permission problems (403) and auth problems (401) from clients.
public class HttpExceptionFilterShould
{
  [Test]
  public void Map_InvalidCommandException_To_400()
  {
    GetStatusCodeFor(new InvalidCommandException(new AddJournalCommand(), "invalid")).Should().Be(400);
  }

  [Test]
  public void Map_InvalidQueryException_To_400()
  {
    GetStatusCodeFor(new InvalidQueryException(new GetJournalQuery(), "invalid")).Should().Be(400);
  }

  [Test]
  public void Map_NotAllowedOperationException_To_403()
  {
    GetStatusCodeFor(new NotAllowedOperationException("not allowed")).Should().Be(403);
  }

  [Test]
  public void Map_TokenValidationException_To_401()
  {
    GetStatusCodeFor(new GoogleTokenValidationException("invalid token")).Should().Be(401);
  }

  [Test]
  public void Map_GenericException_To_500()
  {
    GetStatusCodeFor(new Exception("boom")).Should().Be(500);
  }

  [Test]
  public void DoNothing_WithoutException()
  {
    ActionExecutedContext context = CreateContext(null);

    new HttpExceptionFilter().OnActionExecuted(context);

    context.Result.Should().BeNull();
  }

  private static int? GetStatusCodeFor(Exception exception)
  {
    ActionExecutedContext context = CreateContext(exception);

    new HttpExceptionFilter().OnActionExecuted(context);

    context.ExceptionHandled.Should().BeTrue();
    return ((ObjectResult)context.Result!).StatusCode;
  }

  private static ActionExecutedContext CreateContext(Exception? exception)
  {
    var actionContext = new ActionContext(new DefaultHttpContext(), new RouteData(), new ActionDescriptor());
    return new ActionExecutedContext(actionContext, new List<IFilterMetadata>(), controller: new object())
    {
      Exception = exception
    };
  }
}
