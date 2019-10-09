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
using System.Linq.Expressions;

using Artefactor.Services;
using Artefactor.Services.Converters;


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
        private readonly IConverter<Artefact> _artefactConverter;

        public ArtefactsController(ApplicationDbContext context,
                                UserManager<ApplicationUser> userManager,
                                UserService userService,
                                UploadService uploadService,
                                IConverter<Artefact> artefactConverter)
        {
            _context = context;
            _userManager = userManager;
            _userService = userService;
            _uploadService = uploadService;
            _artefactConverter = artefactConverter;
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
                .Select(a => _artefactConverter.ToJson(a))
                .Where(a => a != null);

            return new JsonResult(artefactsJson);
        }

        [HttpGet("feature")]
        public async Task<ActionResult> GetArtefacts(
            [FromQuery] string user,

            [FromQuery] string q,
            [FromQuery] bool? includeDesc,

            [FromQuery] Visibility vis,

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

            IList<Expression> whereLambdas = new List<Expression>();

            // query strings

            if (q != null)
            {
                if (includeDesc.HasValue)
                {
                    whereLambdas.Add(
                        ArtefactStrQueryExpression(
                            q, includeDesc.Value, artefactParam
                        )
                    );
                }
                else
                {
                    whereLambdas.Add(
                        ArtefactStrQueryExpression(
                            q, false, artefactParam
                        )
                    );
                }
            }

            // visibility

            // if (vis != Visibility.Unspecified)
            // {
            //     try 
            //     {

            //     }
            //     catch (Exception e) {
            //         if (e is QueryException)
            //         {

            //         }
            //         else if (e is )
            //         else
            //         {
                        
            //         }
            //     }
            //     var isAuthorised = VisQueryIsAuthorised();

            //     if ()
            //     {
            //         whereLambdas.Add(
            //             ArtefactVisQueryExpression(vis, artefactParam)
            //         );
            //     }
            //     else
            //     {
            //         return Unauthorized();
            //     }
            // }

            // user


            // AndElse over queryStringExpressions, then call with Where

            Expression whereLambdasAnded = whereLambdas
                .Aggregate(
                    (Expression) Expression.Constant(true),
                    (acc, whereLambda) => Expression.AndAlso(acc, whereLambda)
                );

            Expression whereCallExpression = GetWhereExp(
                whereLambdasAnded, 
                artefactParam, 
                artefacts
            );

            IQueryable<Artefact> results =
                artefacts.Provider.CreateQuery<Artefact>(whereCallExpression);

            return new JsonResult(
                (await results.ToListAsync()).Select(a => _artefactConverter.ToJson(a))
            );

            // Returns a method call expression represented by 
            //
            // 'a => a.Title.ToLower().Contains(query.ToLower()) &&
            //       a.Description.ToLower().Contains(query.ToLower()'
            //
            // Note description search parameterised by 'includeDesc'.
            Expression ArtefactStrQueryExpression(string query, bool includeDesc,
                ParameterExpression artefactParamExp)
            {

                // a.Title

                var paramTitle = Expression.Property(
                    artefactParamExp, typeof(Artefact).GetProperty("Title")
                );

                var paramTitleLowered = Expression.Call(
                    paramTitle,
                    typeof(string).GetMethod("ToLower", System.Type.EmptyTypes)
                );

                // query.ToLower()

                var queryLowered = Expression.Call(
                    paramTitle,
                    typeof(string).GetMethod("ToLower", System.Type.EmptyTypes)
                );

                var paramTitleQueryExpr = 
                    StrContainsQuery(paramTitleLowered, query);

                if (includeDesc)
                {
                    Expression paramDescription = Expression.Property(
                        artefactParamExp, 
                        typeof(Artefact).GetProperty("Description")
                    );

                    Expression paramDescriptionLowered = Expression.Call(
                        paramDescription,
                        typeof(string).GetMethod("ToLower", System.Type.EmptyTypes)
                    );
                    var paramDescriptionQueryExpr = StrContainsQuery(paramDescriptionLowered, query);

                    return Expression.And(
                        paramTitleQueryExpr,
                        paramDescriptionQueryExpr
                    );
                }
                else 
                {
                    return paramTitleQueryExpr;
                }

                MethodCallExpression StrContainsQuery(Expression strExpression, string rawQuery)
                {
                    return Expression.Call(
                            strExpression,
                            typeof(string).
                                GetMethod("Contains", new[] { typeof(string) }),
                            Expression.Constant(query.ToLower(), typeof(string))
                        );
                }
            }

            // returns the raw query - authentication is assumed
            Expression ArtefactVisQueryExpression(Visibility vis, 
                ParameterExpression artefactParamExp)
            {
                var paramVis = Expression.Property(
                    artefactParamExp, typeof(Artefact).GetProperty("Visibility")
                );

                return Expression.Equal(Expression.Constant(vis), paramVis);
            }

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

            // ---

            // expects the query string value 'visListValue' to be of
            // IList<Visibility> VisQueries(string visListValue)
            // {
            //     var visListItems = visListValue.Split(",");

            //     IList<Visibility> visQueries = 
            //         new List<Visibility>(visListItems.Length);

            //     try
            //     {
            //         foreach (var visListItem in visListItems)
            //         {
            //             Visibility itemVis;
            //             Enum.TryParse(visListItem, out itemVis);

            //             if (itemVis.)
            //             visQueries.Add(

            //             );
            //         }
            //         items.Select(visListItem => 
                        
            //     }
            //     catch () {

            //     }
            //     items
            // }

            // bool VisQueryIsAuthorised(Visibility vis)
            // {
            //     if (vis == Visibility.Public)
            //     {
            //         return true;
            //     }
            //     else if (vis == Visibility.Unspecified)
            //     {

            //     }
            //     else 
            //     {
            //         if (vis == Visibility.PrivateFamily)
            //         else if (vis == Visibility.Private)

            //     }
            //     {

            //     }
            // }

            // ---

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

            // Create expression tree represented by 
            // 'data.Where(paramExp => whereExpLambda(paramExp))'
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

            IQueryable<Artefact> artefacts =
                _context.Artefacts
                        .Include(a => a.CategoryJoin)
                            .ThenInclude(cj => cj.Category)
                        .Where(a => a.OwnerId == userWArtefacts.Id);

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
                artefacts = artefacts.Where(a => a.Visibility == vis);
            }

            return new JsonResult(
                (await artefacts.ToListAsync()).Select(a => _artefactConverter.ToJson(a))
            );
        }


        // GET: api/Artefacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetArtefact(string id)
        {
            // possibly a more performant way of doing this -
            // https://stackoverflow.com/questions/40360512/findasync-and-include-linq-statements
            var artefact = await _context.Artefacts
                                         .Include(a => a.CategoryJoin)
                                            .ThenInclude(cj => cj.Category)
                                         .Include(a => a.Owner)
                                         .SingleOrDefaultAsync(a => a.Id == id);

            if (artefact == null)
            {
                return NotFound();
            }

            return new JsonResult(_artefactConverter.ToJson(artefact));
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
            var artefactJson = _artefactConverter.ToJson(artefact);
            
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
            catch (Exception)
            {
                return StatusCode(500);
            }
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
