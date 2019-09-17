using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Artefactor.Data;
using Artefactor.Models;

namespace Artefactor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtefactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArtefactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Artefacts/VisibilityOpts
        [HttpGet("VisibilityOpts")]
        public async Task<ActionResult<IEnumerable<object>>> VisibilityOpts()
        {
            var genreList = MapEnumToDictionary<Visibility>()
                .Select(entry => new { Value = entry.Key, Name = entry.Value })
                .ToList();

            return genreList;
        }

        // thanks to - https://stackoverflow.com/a/41499029
        private Dictionary<int, string> MapEnumToDictionary<T>()
        {
            // Ensure T is an enumerator
            if (!typeof(T).IsEnum)
            {
                throw new ArgumentException("T must be an enumerator type.");
            }

            // Return Enumertator as a Dictionary
            return Enum.GetValues(typeof(T))
                       .Cast<T>()
                       .ToDictionary(i => (int)Convert.ChangeType(i, i.GetType()), t => t.ToString());
        }

        // GET: api/Artefacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artefact>>> GetArtefacts()
        {
            var artefacts = await _context.Artefacts
                                          .Include(a => a.CategoryJoin)
                                          .ToListAsync();

            return artefacts;
        }

        // GET: api/Artefacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Artefact>> GetArtefact(string id)
        {
            var artefact = await _context.Artefacts.FindAsync(id);

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
