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
        public async Task<ActionResult<IEnumerable<Artefact>>> GetArtefacts()
        {
            var artefacts = await _context.Artefacts
                                          .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                          .ToListAsync();

            return artefacts;
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

            // the request user can access 'private' artefacts of 'username' if
            // they are the same user
            if (curUser != null)
            {
                curUserIsUsername = curUser.Id == userWArtefacts.Id;
                curUserIsFamily = curUser.Id == userWArtefacts.Id;  // TODO
            }

            // filter artefacts based on permissions and current user

            List<Artefact> artefacts = await
                _context.Artefacts
                        .Include(a => a.CategoryJoin)
                            .ThenInclude(cj => cj.Category)
                        .Where(a => a.OwnerId == userWArtefacts.Id)
                        .ToListAsync();

            if ((!curUserIsUsername && vis == Visibility.Private) ||
                 !curUserIsFamily && vis == Visibility.PrivateFamily)
            {
                return Unauthorized("Insufficient permissions to " +
                                    "view the requested recourse.");
            }

            // don't filter on visibility if vis == Visibility.Unspecified
            if ((curUserIsUsername && vis == Visibility.Private) ||
                     (curUserIsFamily && vis == Visibility.PrivateFamily) ||
                     (!curUserIsUsername && vis == Visibility.Public))
            {
                artefacts = artefacts.Select(a => a)
                                     .Where(a => a.Visibility == vis)
                                     .ToList();
            }

            // it would be much better for performance reasons to create
            // a Newtonsoft.Json.JsonConverter, but this will be done for now
            IList<object> artefactsJson = new List<object>(artefacts.Count);
            foreach (var a in artefacts)
            {
                var owner = new
                {
                    a.Owner.Id,
                    a.Owner.UserName,
                };

                var categoryJoin =
                    a.CategoryJoin
                     .Select(cj =>
                     {
                         cj.Category = new Category
                         {
                             Name = cj.Category.Name,
                             Id = cj.Category.Id ,
                         };
                         return cj;
                     })
                     .ToList();

                var convertedArtefact = new
                {
                    a.Id,
                    a.Title,
                    a.Description,
                    owner = RestrictedObjAppUserView(a.Owner),
                    categoryJoin,
                };

                artefactsJson.Add(convertedArtefact);
            }

            return new JsonResult(artefactsJson);

            object RestrictedObjAppUserView(ApplicationUser u)
            {
                return new
                {
                    Id = u.Id,
                    Username = u.UserName,
                    Bio = u.Bio,
                };
            }

            //ApplicationUser RestrictedAppUserView(ApplicationUser u)
            //{
            //    return new ApplicationUser
            //    {
            //        Id = u.Id,
            //        UserName = u.UserName,
            //        Bio = u.Bio,
            //    };
            //}
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
            var curUserId = UserService.GetCurUserId(HttpContext);

            _context.Attach(artefact);
            // OwnerId is shadow property
            _context.Entry(artefact).Property("OwnerId").CurrentValue = curUserId;

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
