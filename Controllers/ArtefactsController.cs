using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Artefactor.Data;
using Artefactor.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Runtime.Serialization;

using Artefactor.Services;
using System.Collections;

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
            // 'EnumMemberAttribute' values are converted by 'NewtonsoftJsonConverter'
            // to 'Visibility'
            var visVals = 
                new List<Visibility>((Visibility[])Enum.GetValues(typeof(Visibility)));

            var visValsEnumMemberAttribs = visVals
                .Select(eVal => EnumHelper.GetAttributeOfType<EnumMemberAttribute>(eVal))
                .Where(enumMemberAttrib => enumMemberAttrib != null)
                .Select(enumMemberAttrib => enumMemberAttrib.Value)
                .ToList();

            return visValsEnumMemberAttribs;

        }

        // GET: api/Artefacts
        [HttpGet]
        public async Task<IActionResult> GetPublicArtefacts()
        {
            var artefacts = await _context.Artefacts
                                          .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                          .Include(a => a.Owner)
                                          .Where(a => 
                                            a.Visibility == Visibility.Public)
                                          .ToListAsync();

            var artefactsJson = artefacts
                .Select(a => ArtefactJson(a))
                .Where(a => a != null);

            return new JsonResult(artefactsJson);
        }

        /**
         * Get artefacts owned by 'username' with visibility 'vis',
         * or all visibilities if 'vis' not specified.
         * 
         * The requesting user must have the appropriate permissions.
         */
        [HttpGet("user/{username}")]
        public async Task<ActionResult<IEnumerable<Artefact>>> GetUserArtefacts(string username, 
            [FromQuery]
            [JsonConverter(typeof(StringEnumConverter))]
            Visibility vis)
        {
            ApplicationUser userWArtefacts;

            ApplicationUser curUser = await UserService.GetCurUser(HttpContext, _userManager);
            bool curUserIsUsername = false;  
            bool curUserIsFamily = false;  // TODO once families implemented

            // user {username} is either curUser or another user - assign to 'userWArtefacts'

            if (curUser != null && curUser.UserName == username)
            {
                userWArtefacts = curUser;
            }
            else
            {
                userWArtefacts = await _userManager.FindByNameAsync(username);

                if (userWArtefacts == null)
                {
                    return NotFound();
                }
            }

            IQueryable<Artefact> artefacts =
                _context.Artefacts
                        .Include(a => a.CategoryJoin)
                            .ThenInclude(cj => cj.Category)
                        .Where(a => a.OwnerId == userWArtefacts.Id);

            // the request user can access 'private' artefacts of 'username' if
            // they are the same user
            if (curUser != null)
            {
                curUserIsUsername = curUser.Id == userWArtefacts.Id;
                curUserIsFamily = curUser.Id == userWArtefacts.Id;  // TODO
            }
            else
            {
                artefacts = artefacts.Where(a => a.Visibility == Visibility.Public);
                return new JsonResult((await artefacts.ToListAsync())
                        .Select(a => ArtefactJson(a)));
            }

            // filter artefacts based on permissions and current user

            

            if ((!curUserIsUsername && vis == Visibility.Private) ||
                 !curUserIsFamily && vis == Visibility.PrivateFamily)
            {
                return Unauthorized("Insufficient permissions to " +
                                    "view the requested recourse.");
            }

            // filter on private or family if user logged in
            if ((curUserIsUsername && vis == Visibility.Private) ||
                (curUserIsFamily && vis == Visibility.PrivateFamily))
            {
                artefacts = artefacts.Where(a => a.Visibility == vis);
            }

            //if (!curUserIsUsername && (vis == Visibility.Public || vis == Visibility.Unspecified))
            //{
            //    artefacts = artefacts.Where(a => a.Visibility == Visibility.Public);
            //}

            //var artefactsJson = await
            //    .ToListAsync();

            return new JsonResult((await artefacts.ToListAsync())
                .Select(a => ArtefactJson(a)));
        }

        /**
         * 'a' must have owner and category join non-null, or this method will
         * return null.
         */
        private object ArtefactJson(Artefact a)
        {
            // it would be much better for performance reasons to create
            // a Newtonsoft.Json.JsonConverter, but this will be done for now

            object owner = null;
            if (a.Owner != null)
            {
                owner = RestrictedObjAppUserView(a.Owner);
            }


            object categoryJoin = null;
            if (a.CategoryJoin != null)
            {
                categoryJoin = 
                    a.CategoryJoin
                     .Select(cj => RestrictedObjCategoryJoinView(cj));
            }

            return new
            {
                a.Id,
                a.Title,
                a.Description,
                a.CreatedAt,

                owner,
                categoryJoin,
            };

            // Prepare an 'ApplicationUser' for returning to a client.
            object RestrictedObjAppUserView(ApplicationUser u)
            {
                return new
                {
                    u.Id,
                    Username = u.UserName,
                    u.Bio,
                };
            }

            // Prepare an 'CategoryJoin' for returning to a client.
            // 'cj' must have 'cj.Category' and 'cj.Artefact' loaded.
            object RestrictedObjCategoryJoinView(ArtefactCategory cj)
            {
                var category = new
                {
                    cj.Category.Name,
                };
                var artefact = new
                {
                    cj.Artefact.Title,
                };

                return new
                {
                    cj.CategoryId,
                    category,
                    cj.ArtefactId,
                    artefact,
                };
            }
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
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Artefact>> PostArtefact(Artefact artefact)
        {
            // it would be better design to just return id, but clients
            // may need owner username
            var curUser = await UserService.GetCurUser(HttpContext, _userManager);

            _context.Attach(artefact);

            artefact.CreatedAt = DateTime.UtcNow;
            // OwnerId is shadow property
            _context.Entry(artefact).Property("OwnerId").CurrentValue = curUser.Id;

            //_context.Artefacts.Add(artefact);
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

            artefact.Owner = curUser;
            var artefactJson = ArtefactJson(artefact);
            
            return CreatedAtAction("GetArtefact", new { id = artefact.Id },
              artefactJson);
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
