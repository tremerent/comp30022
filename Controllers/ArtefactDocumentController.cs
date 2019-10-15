using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Artefactor.Data;
using Artefactor.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using Artefactor.Services;

namespace Artefactor.Controllers
{
    [Route("api/documents")]
    [ApiController]
    public class ArtefactDocumentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserService _userService;
        private readonly UploadService _uploadService;

        public ArtefactDocumentsController(ApplicationDbContext context,
                                UserService userService,
                                UploadService uploadService)
        {
            _context = context;
            _userService = userService;
            _uploadService = uploadService;
        }     
        
        [HttpPost("document")]
        [Authorize]
        public async Task<IActionResult> AddDocument(
            [FromQuery] string artefactId,
            [FromQuery] DocType docType,
            [FromForm] IFormFile file)
        {
            if (docType is DocType.Unspecified)
            {
                return BadRequest($"'docType' query '{docType.ToString()}' invalid.");
            }

            var dbArt = await _context
                .Artefacts
                .SingleOrDefaultAsync(a => a.Id == artefactId);

            if (dbArt == null)
            {
                return NotFound();
            }

            if (!await _userService.IsCurUser(dbArt.OwnerId, null, HttpContext))
            {
                return Unauthorized();
            }

            try
            {
                Uri uri =
                    await _uploadService.UploadFileToBlobAsync(file.FileName, file);

                await _context.AddAsync(new ArtefactDocument
                {
                    Title = file.FileName,
                    Url = uri.AbsoluteUri,
                    ArtefactId = artefactId,
                    DocType = docType,
                });

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.ToString());
            }

            return Ok();
        }

        [HttpDelete("document")]
        [Authorize]
        public async Task<IActionResult> RemoveDocument(
            [FromQuery] string artefactId,
            [FromQuery] string docUrl)
        {
            var dbArt = await _context
                .Artefacts
                .SingleOrDefaultAsync(a => a.Id == artefactId);

            if (dbArt == null)
            {
                return NotFound();
            }

            if (!await _userService.IsCurUser(dbArt.OwnerId, null, HttpContext))
            {
                return Unauthorized();
            }

            try {
                _context.Remove(
                    await _context
                        .ArtefactDocuments
                        .SingleOrDefaultAsync(doc => doc.Url == docUrl)
                );

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
    }
}