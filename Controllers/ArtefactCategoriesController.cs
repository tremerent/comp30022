using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using Artefactor.Data;
using Artefactor.Models;

namespace Artefactor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ArtefactCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArtefactCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ArtefactCategories
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ArtefactCategory>>> GetArtefactCategory()
        {
            return await _context.ArtefactCategory.ToListAsync();
        }

        // GET: api/ArtefactCategories/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ArtefactCategory>> GetArtefactCategory(string id)
        {
            var artefactCategory = await _context.ArtefactCategory.FindAsync(id);

            if (artefactCategory == null)
            {
                return NotFound();
            }

            return artefactCategory;
        }

        // PUT: api/ArtefactCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArtefactCategory(string id, ArtefactCategory artefactCategory)
        {
            if (id != artefactCategory.ArtefactId)
            {
                return BadRequest();
            }

            _context.Entry(artefactCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArtefactCategoryExists(id))
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

        // POST: api/ArtefactCategories
        [HttpPost]
        public async Task<ActionResult<ArtefactCategory>> PostArtefactCategory(ArtefactCategory artefactCategory)
        {
            _context.ArtefactCategory.Add(artefactCategory);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ArtefactCategoryExists(artefactCategory.ArtefactId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetArtefactCategory", new { id = artefactCategory.ArtefactId }, artefactCategory);
        }

        // POST: api/ArtefactCategories/Many
        [HttpPost("Many")]
        public async Task<ActionResult<ArtefactCategory>> PostManyArtefactCategory(
            IEnumerable<ArtefactCategory> artefactCategories
        )
        {
            foreach (var ac in artefactCategories) {
                _context.ArtefactCategory.Add(ac);
            };

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (artefactCategories.Any(ac => ArtefactCategoryExists(ac.ArtefactId)))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetArtefactCategory", artefactCategories);
        }

        [HttpDelete]
        public async Task<ActionResult<ArtefactCategory>> DeleteArtefactCategory(
            [FromQuery] string artefactId, 
            [FromQuery] string categoryId
        )
        {
            var artefactCategory = await _context
                .ArtefactCategory
                .Where(ac => ac.ArtefactId == artefactId && 
                       ac.CategoryId == categoryId)
                .SingleOrDefaultAsync();
                
            if (artefactCategory == null)
            {
                return NotFound();
            }

            _context.ArtefactCategory.Remove(artefactCategory);
            await _context.SaveChangesAsync();

            return artefactCategory;
        }

        private bool ArtefactCategoryExists(string id)
        {
            return _context.ArtefactCategory.Any(e => e.ArtefactId == id);
        }
    }
}
