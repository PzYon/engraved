using Engraved.Core.Application;
using Engraved.Core.Application.Queries.Files.CreateUpload;
using Engraved.Core.Application.Queries.Files.GetUrl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Engraved.Api.Controllers;

// File bytes never pass through the API: it hands out time-bound URLs and the browser talks to the
// storage account directly. That is also what makes images work at all, as the browser will not put
// the bearer token on an <img> request.
[ApiController]
[Route("api/files")]
[Authorize]
public class FilesController(Dispatcher dispatcher) : ControllerBase
{
  // Returns the file reference to put on the entry's Files, a URL to upload the bytes to, and
  // a URL to read them back - the last one because until the entry is saved nothing references the
  // file, and GetUrl resolves permissions through the owning entry.
  [HttpPost]
  public async Task<CreateFileUploadResult> CreateUpload([FromBody] CreateFileUploadQuery query)
  {
    return await dispatcher.Query<CreateFileUploadResult, CreateFileUploadQuery>(query);
  }

  [HttpGet]
  [Route("{fileId}/url")]
  public async Task<ActionResult<GetFileUrlResult>> GetUrl(string fileId)
  {
    GetFileUrlResult? result = await dispatcher.Query<GetFileUrlResult?, GetFileUrlQuery>(
      new GetFileUrlQuery { FileId = fileId }
    );

    if (result == null)
    {
      return NotFound();
    }

    return result;
  }
}
