using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Artefactor.Data;
using Artefactor.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

using Helpers;
using System.Runtime.Serialization;

namespace Artefactor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtefactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;


        public ArtefactsController(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Artefacts/VisibilityOpts
        [HttpGet("VisibilityOpts")]
        public async Task<ActionResult<IEnumerable<string>>> VisibilityOpts()
        {
            // get value of 'EnumMemberAttribute' from each value of enum 'Visibility' -
            // 'EnumMemberAttribute' values are desiralised to 'Visibility'
            var visVals = 
                new List<Visibility>((Visibility[])Enum.GetValues(typeof(Visibility)));
            var visValsEnumMemberAttribs = visVals
                .Select(eVal => EnumHelper.GetAttributeOfType<EnumMemberAttribute>(eVal)
                                       .Value)
                .ToList();

            return visValsEnumMemberAttribs;

        }

        // GET: api/Artefacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artefact>>> GetArtefacts()
        {
            var artefacts = await _context.Artefacts
                                          .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                          .ToListAsync();

            return artefacts;
        }

        [HttpGet("user/{username}")]
        public async Task<ActionResult<IEnumerable<Artefact>>> GetUserArtefacts(string username, 
            [FromQuery]
            [JsonConverter(typeof(StringEnumConverter))]
            Visibility vis)
        {

            var artefacts = await _context.Artefacts
                                        .Include(a => a.Owner)
                                        .Where(a => a.Owner.UserName == username)
                                        .Where(a => a.Visibility == vis)
                                        .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                        .ToListAsync();

            return artefacts;
        }


        // GET: api/Artefacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Artefact>> GetArtefact(string id)
        {
            // possibly a more performant way of doing this -
            // https://stackoverflow.com/questions/40360512/findasync-and-include-linq-statements
            var artefact = await _context.Artefacts
                                         .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                         .SingleOrDefaultAsync(a => a.Id == id);

            if (artefact == null)
            {
                return NotFound();
            }

            return artefact;
        }

        // PUT: api/Artefacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtefact(string id, Artefact artefact)
        {
            if (id != artefact.Id)
            {
                return BadRequest();
            }

            _context.Entry(artefact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArtefactExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Artefacts
        [HttpPost]
        public async Task<ActionResult<Artefact>> PostArtefact(Artefact artefact)
        {
            var curUser = await _userManager.GetUserAsync(HttpContext.User);

            artefact.Owner = curUser;

            _context.Artefacts.Add(artefact);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ArtefactExists(artefact.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetArtefact", new { id = artefact.Id }, artefact);
        }

        // DELETE: api/Artefacts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Artefact>> DeleteArtefact(string id)
        {
            var artefact = await _context.Artefacts.FindAsync(id);
            if (artefact == null)
            {
                return NotFound();
            }

            _context.Artefacts.Remove(artefact);
            await _context.SaveChangesAsync();

            return artefact;
        }

        private bool ArtefactExists(string id)
        {
            return _context.Artefacts.Any(e => e.Id == id);
        }
    }
}
