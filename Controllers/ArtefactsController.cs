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
using Microsoft.AspNetCore.Http;

using Artefactor.Services;
using System.Linq.Expressions;

namespace Artefactor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtefactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UserService _userService;
        private readonly UploadService _uploadService;

        public ArtefactsController(ApplicationDbContext context,
                                UserManager<ApplicationUser> userManager,
                                UserService userService,
                                UploadService uploadService)
        {
            _context = context;
            _userManager = userManager;
            _userService = userService;
            _uploadService = uploadService;
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
            var artefacts_ = await _context.Artefacts
                                          .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                          .Include(a => a.Owner)
                                          .Where(a =>
                                            a.Visibility == Visibility.Public)
                                          .ToListAsync();

            var artefacts = _context.Artefacts;

            artefacts
                .Include(a => a.CategoryJoin)
                    .ThenInclude(cj => cj.Category)
                .Include(a => a.Owner)
                .Where(a =>
                    a.Visibility == Visibility.Public
                ).Load();

            artefacts.Include(a => a.Images).Load();

            //var allDocs = _context.ArtefactDocuments.;
            //foreach (Artefact a in artefacts) {
            //    var docs = await _context.ArtefactDocuments
            //                    .Where(doc => doc.ArtefactId == a.Id).ToListAsync();
            //    a.Images = docs;
            //}

            var artefactsJson = artefacts_
                .Select(a => ArtefactJson(a))
                .Where(a => a != null);

            return new JsonResult(artefactsJson);
        }

        [HttpGet("feature")]
        public async Task<ActionResult> GetArtefacts(
            [FromQuery] string user,

            [FromQuery] string q,
            [FromQuery] bool? includeDesc,

            [FromQuery] string vis,

            [FromQuery] List<string> categories,
            [FromQuery] bool? matchAll,

            [FromQuery] DateTime since,
            [FromQuery] DateTime until,

            [FromQuery] string sort
        )
        {
            IQueryable<Artefact> artefacts =
                _context.Artefacts
                        .Include(a => a.CategoryJoin)
                            .ThenInclude(cj => cj.Category);

            ParameterExpression artefactParam = 
                Expression.Parameter(typeof(Artefact), "artefact");

            IList<Expression> whereQueries = new List<Expression>();

            if (q != null)
            {
                if (includeDesc.HasValue)
                {
                    whereQueries.Add(
                        ArtefactQueryStringExpression(
                            q, includeDesc.Value, artefactParam
                        )
                    );
                }
                else
                {
                    whereQueries.Add(
                        ArtefactQueryStringExpression(
                            q, false, artefactParam
                        )
                    );
                }
            }

            Expression whereCallExpression = GetWhereExp(whereQueries.First(), 
                artefactParam, artefacts);

            IQueryable<Artefact> results =
                artefacts.Provider.CreateQuery<Artefact>(whereCallExpression);

            return new JsonResult(
                (await results.ToListAsync()).Select(a => ArtefactJson(a))
            );

            //ApplicationUser queryUser;
            //if (user != null)
            //{
            //    queryUser = await _userManager.FindByNameAsync(user);
            //    try
            //    {
            //        WhereQueries.Add(await UserQuery(queryUser));
            //    }
            //    catch (QueryException e)
            //    {
            //        if (e.IsAuth)
            //        {
            //            return Unauthorized();
            //        }
            //        else if (e.IsQuery)
            //        {
            //            return NotFound();
            //        }
            //    }
            //}

            //if (vis != null)
            //{
            //    if (vis == "private" || vis == "public")
            //    {

            //    }
            //}

            // query string

            //Func<Artefact, bool> QueryStringQuery()
            //{
            //    Func<Artefact, bool> queryString;

            //    if (includeDesc.HasValue && includeDesc.Value == true)
            //    {
            //        queryString =
            //            a => a.Title.ToLower().Contains(q) ||
            //                    a.Title.ToLower().Contains(q);
            //    }
            //    else
            //    {
            //        queryString = a => a.Title.ToLower().Contains(q);
            //    }

            //    return queryString;

            //}

            //    a => a.Title.ToLower().Contains(q) ||
            //            a.Title.ToLower().Contains(q);            
            Expression ArtefactQueryStringExpression(string query, bool includeDesc,
                ParameterExpression paramExp)
            {
                Expression paramTitle = Expression.Property(
                    paramExp, typeof(Artefact).GetProperty("Title")
                );


                Expression paramTitleLowered = Expression.Call(
                    paramTitle,
                    typeof(string).GetMethod("ToLower", System.Type.EmptyTypes)
                );

                return Expression.Call(
                    paramTitleLowered,
                    typeof(string).GetMethod("Contains"),
                    Expression.Constant(query, typeof(string))
                );
            }



            // username & visibility

            //async Task<Func<Artefact, bool>> UserQuery(ApplicationUser appUser)
            //{
            //    return a => a.OwnerId == appUser.Id;
            //}

            //async Task<Func<Artefact, bool>> VisQuery(ApplicationUser appUser)
            //{
            //    var appUser = await _userManager.FindByNameAsync(user);

            //    if (appUser == null)
            //    {
            //        throw new QueryException { IsAuth = true };
            //    }

            //    bool curUserIsAppUser = false;
            //    try
            //    {
            //        curUserIsAppUser =
            //            await _userService.IsCurUser(appUser.Id, null, HttpContext);
            //    }
            //    catch (Exception e)
            //    {
            //        if (e is ArgumentException)
            //        {
            //            // no current user logged in
            //            curUserIsAppUser = false;
            //        }
            //        else if (e is ArgumentException)
            //        {
            //            // this is unreachable since checked 'appUser == null'
            //            throw e;
            //        }
            //        else throw e;
            //    }

            //    curUserIsAppUser


            //}

            MethodCallExpression GetWhereExp<T>(
                Expression whereExpBody,
                ParameterExpression paramExp,
                IQueryable<T> data)
            {
                return Expression.Call(
                    typeof(Queryable),
                    "Where",
                    new Type[] { data.ElementType },
                    data.Expression,
                    Expression.Lambda<Func<T, bool>>(
                        whereExpBody, new ParameterExpression[] { paramExp })
                    );
            }
        }

        private class QueryException : Exception
        {
            public bool IsAuth { get; set; } = false;
            public bool IsQuery { get; set; } = false;
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
            bool curUserIsUsername = false;
            bool curUserIsFamily = false;  // TODO once families implemented

            ApplicationUser userWArtefacts = await _userManager.FindByNameAsync(username);

            if (userWArtefacts == null)
            {
                return NotFound();
            }

            try
            {
                curUserIsUsername = await _userService.IsCurUser(null, username, HttpContext);
            }
            catch (Exception e)
            {
                if (e is ArgumentNullException)
                {
                    // 'username' was not found
                    return NotFound();
                }
                else
                {
                    throw e;
                }
            }

            //IQueryable<Artefact> artefacts =
            var artefacts =
                _context.Artefacts; artefacts
                        .Include(a => a.CategoryJoin)
                            .ThenInclude(cj => cj.Category)
                        .Where(a => a.OwnerId == userWArtefacts.Id).Load();

            artefacts.Include(a => a.Images).Load();

            // check permissions
            if ((!curUserIsUsername && vis == Visibility.Private) ||
                 !curUserIsFamily && vis == Visibility.PrivateFamily)
            {
                return Unauthorized("Insufficient permissions to " +
                                    "view the requested recourse.");
            }

            // user has appropriate permissions, so return the filtered list
            if ((curUserIsUsername && vis == Visibility.Private) ||
                (curUserIsFamily && vis == Visibility.PrivateFamily) ||
                (!curUserIsUsername && !curUserIsFamily && vis == Visibility.Public))
            {
                //artefacts = artefacts.Where(a => a.Visibility == vis);
                artefacts.Where(a => a.Visibility == vis).Load();
            }

            return new JsonResult(
                (await artefacts.ToListAsync()).Select(a => ArtefactJson(a))
            );
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


            object categoryJoin = new List<string>();
            if (a.CategoryJoin != null)
            {
                categoryJoin =
                    a.CategoryJoin
                     .Select(cj => RestrictedObjCategoryJoinView(cj));
            }

            object images = null;
            if (a.Images != null)
            {
                images = a.Images
                    .Select(img => new {
                        id      = img.Id,
                        title   = img.Title,
                        url     = img.Url,
                        type    = img.DocType,
                    });
            }

            return new
            {
                a.Id,
                a.Title,
                a.Description,
                a.CreatedAt,
                a.Visibility,

                images,
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
        public async Task<ActionResult> GetArtefact(string id)
        {
            // possibly a more performant way of doing this -
            // https://stackoverflow.com/questions/40360512/findasync-and-include-linq-statements
            var artefact = await _context.Artefacts
                                         .Include(a => a.Images)
                                         .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                         .Include(a => a.Owner)
                                         .SingleOrDefaultAsync(a => a.Id == id);

            var coolaf = await _context.ArtefactDocuments.SingleOrDefaultAsync(doc => doc.ArtefactId == id);

            if (artefact == null)
            {
                return NotFound();
            }

            return new JsonResult(ArtefactJson(artefact));
        }

        // POST: api/Artefacts
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Artefact>> PostArtefact(Artefact artefact)
        {
            // it would be better design to just return id, but clients
            // may need owner username
            var curUser = await _userService.GetCurUser(HttpContext);

            _context.Attach(artefact);

            artefact.CreatedAt = DateTime.UtcNow;
            // OwnerId is shadow property
            _context.Entry(artefact).Property("OwnerId").CurrentValue = curUser.Id;

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

        // PATCH: api/Artefacts/as23-123
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> EditArtefact(string id, Artefact artefact)
        {
            if (id != artefact.Id)
            {
                return BadRequest();
            }

            var dbArt = await _context
                .Artefacts
                .SingleOrDefaultAsync(a => a.Id == artefact.Id);

            if (dbArt == null)
            {
                return NotFound();
            }

            if (!await _userService.IsCurUser(dbArt.OwnerId, null, HttpContext))
            {
                return Unauthorized();
            }

            foreach (var patchProperty in artefact.GetType().GetProperties())
            {
                string patchPropName = patchProperty.Name;
                object patchPropValue = patchProperty.GetValue(artefact);

                if (patchPropValue != null && IsModifiable(patchPropName))
                {
                    SetPropertyValue(dbArt, patchPropName, patchPropValue);
                }
            }

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

            // it would be cool to have these as attributes on the Artefact object
            bool IsModifiable(string artefactProperty)
            {
                return !(
                    artefactProperty == "Id" ||
                    artefactProperty == "CreatedAt" ||
                    artefactProperty == "OwnerId" ||
                    artefactProperty == "Owner" ||
                    artefactProperty == "Title" ||
                    artefactProperty == "CategoryJoin"
                );
            }

            void SetPropertyValue<T> (T obj, string propertyName, object propertyValue)
            {
                typeof(T)
                    .GetProperty(propertyName)
                    .SetValue(obj, propertyValue);
            }
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

        [HttpPost("image")]
        [Authorize]
        public async Task<IActionResult> AddImage(
            [FromQuery] string artefactId,
            [FromForm] IFormFile file)
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

            try
            {
                Uri uri =
                    await _uploadService.UploadFileToBlobAsync(file.FileName, file);

                await _context.AddAsync(new ArtefactDocument
                {
                    Title = file.FileName,
                    Url = uri.AbsoluteUri,
                    ArtefactId = artefactId,
                    DocType = DocType.Image,
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

        [HttpDelete("{artefactId}/image")]
        [Authorize]
        public async Task<IActionResult> RemoveImage(
            [FromQuery] string artefactId,
            [FromQuery] string img_url)
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
                        .SingleOrDefaultAsync(doc => doc.Url == img_url)
                );

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        private bool ArtefactExists(string id)
        {
            return _context.Artefacts.Any(e => e.Id == id);
        }
    }
}
