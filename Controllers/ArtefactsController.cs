﻿using System;
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
using System.Reflection;

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

            [FromQuery] string q,  // query by string
            [FromQuery] bool? includeDesc,

            [FromQuery] string vis,  // eg. ...&vis=public,private&...

            [FromQuery] string[] category,
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

            // visibility query - handles auth
            
            // first initialise curUser and queryUser - check for NotFound
            ApplicationUser curUser = await _userService.GetCurUser(HttpContext);
            ApplicationUser queryUser = null;  // query 'user'
            if (user != null)
            {
                // this throws if 'user == null'
                queryUser = await _userManager.FindByNameAsync(user);

                if (queryUser == null)
                {
                    return NotFound("'user' does not exist.");
                }
            }

            if (vis != null)
            {
                IList<string> visQueryStrings = QueryStringValueList(vis);
                IEnumerable<Visibility> visQueryEnums;
                try 
                {
                    visQueryEnums = visQueryStrings
                        .Select(visString => VisStringQueryToEnum(visString));
                }
                catch (QueryException)
                {
                    return BadRequest("Badly formatted query 'vis'");
                }

                if (visQueryEnums.Any(visQuery => 
                    !VisQueryIsAuthorised(visQuery, curUser, queryUser)))
                {
                    return Unauthorized();
                }
                else
                {
                    foreach(Visibility visQuery in visQueryEnums)
                    {
                        whereLambdas.Add(
                            ArtefactVisQueryExpression(visQuery, artefactParam)
                        );
                    }

                }
            }

            // user query

            // Visibility filter should already have been authorised and added 
            // to 'whereLambdas'.
            //
            // If no 'vis' query was specified, just returns public artefacts
            // of user.

            if (user != null)
            {
                if (vis == null)
                {
                    whereLambdas.Add(
                        ArtefactVisQueryExpression(
                            Visibility.Public, artefactParam)
                    );
                }

                whereLambdas.Add(
                    ArtefactUserQueryExpression(queryUser.Id, artefactParam)
                );

            }
            else
            {
                // no user was specified and vis. authorisation has already
                // been applied - so just filter to see only public
                whereLambdas.Add(
                    ArtefactVisQueryExpression(
                        Visibility.Public, artefactParam)
                );
            }

            // query string query

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

            // categories query

            if (category != null && category.Length > 0)
            {
                var categoryLambdas = category
                    .Select(cat => CategoryQueryExpression(cat, artefactParam));

                Expression categoryLambdasJoined;

                // if matchAll, artefact must belong to every category in query
                // 'category'
                if (matchAll.HasValue && matchAll.Value) {
                    categoryLambdasJoined = FoldBoolLambdas(
                        (Expression) Expression.Constant(true),
                        categoryLambdas,
                        Expression.AndAlso
                    );
                }
                else {
                    categoryLambdasJoined = FoldBoolLambdas(
                        (Expression) Expression.Constant(false),
                        categoryLambdas,
                        Expression.OrElse
                    );
                }

                whereLambdas.Add(categoryLambdasJoined);
            }

            // since & until

            bool isSpecified(DateTime date) 
            {
                return since.Kind != DateTimeKind.Unspecified;
            }

            if (since != null && isSpecified(since))
            {
                whereLambdas.Add(
                    // ArtefactCreatedAtQueryExpression(
                    //     (artCreatedAtDate) => { 
                    //         return 0 <= since.CompareTo(artCreatedAtDate); 
                    //     },
                    //     artefactParam
                    // )
                    ArtefactCreatedAtQueryExpression(
                        since,
                        true,
                        artefactParam
                    )
                );
            }
            if (until != null && isSpecified(until))
            {
                whereLambdas.Add(
                    ArtefactCreatedAtQueryExpression(
                        until,
                        false,
                        artefactParam
                    )
                );
            }

            // All whereLambdas have been added. 
            // AndElse over whereLambdas, then call with Where

            Expression whereLambdasAnded = FoldBoolLambdas(
                (Expression) Expression.Constant(true),
                whereLambdas,
                Expression.AndAlso
            );

            Expression whereCallExpression = GetWhereExp<Artefact>(
                whereLambdasAnded, 
                artefactParam, 
                artefacts
            );

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

            // finally, compile and return results

            IQueryable<Artefact> results =
                artefacts.Provider.CreateQuery<Artefact>(whereCallExpression);

            return new JsonResult(
                (await results.ToListAsync()).Select(a => _artefactConverter.ToJson(a))
            );


            /// linq query expressions

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

            // artefact => artefact.OwnerId == userId
            Expression ArtefactUserQueryExpression(string userId, 
                ParameterExpression artefactParamExp)
            {
                var paramOwnerId = Expression.Property(
                    artefactParamExp, typeof(Artefact).GetProperty("OwnerId")
                );

                return Expression.Equal(Expression.Constant(userId), paramOwnerId);
            }

            // it would be more efficient to express this query by doing a 
            // `_context.ArtefactCategories
            //           .Include(ac => ac.Category).Where(ac => ac.Category.Name == category)`
            // but going to do the "easy" expression way for now
            // (this hopefully shouldn't be too unperformant since linq will
            // compile to joins anyway?)
            Expression CategoryQueryExpression(string categoryName,
                ParameterExpression artefactParamExp)
            {
                // a => a.CategoryJoin.Any(cj => cj.Category.Name == category)

                var queryCategory = Expression.Constant(categoryName);

                // cj.Category.Name
                var cjExp = 
                    Expression.Parameter(typeof(ArtefactCategory));
                var cjCategoryNameExp = Expression.Property(
                    Expression.Property(cjExp, "Category"), 
                "Name");

                // cj.Category.Name == category
                var condition = Expression.Equal(queryCategory, cjCategoryNameExp);

                // cj => cj.Category.Name == category
                var predicate = Expression.Lambda<Func<ArtefactCategory, bool>>(
                    condition,
                    cjExp
                );

                // a.CategoryJoin
                Expression paramCategoryJoin = Expression.Property(
                    artefactParamExp, typeof(Artefact).GetProperty("CategoryJoin")
                );

                var expBody = Expression.Call(
                    typeof(Enumerable),
                    "Any",
                    new Type[] { typeof(ArtefactCategory) },
                    paramCategoryJoin,
                    predicate
                );

                return expBody;
            }

            
            // 'shouldIncludeArtefact' should return true when the DateTime 
            // should be included.
            Expression ArtefactCreatedAtQueryExpression(
                DateTime queryDate,
                bool isSince,  // if false, then is until
                //Func<DateTime, bool> shouldIncludeArtefact, ahhhh why can this not be done
                ParameterExpression artefactParamExp)
            {
                var paramCreatedAt = Expression.Property(
                    artefactParamExp, typeof(Artefact).GetProperty("CreatedAt")
                );

                // WIP... see above ...
                // var param = Expression.Parameter(typeof(DateTime));
                // var lam = Expression.Invoke(
                //     Expression.Constant(shouldIncludeArtefact),
                //     param
                // );
                // return Expression.Lambda(
                //     lam, 
                // );

                // var call = Expression.Invoke(
                //     Expression.Constant(shouldIncludeArtefact), 
                //     paramCreatedAt
                // ).Expression;
                
                // var call = Expression.Invoke(
                //         Expression.Constant(shouldIncludeArtefact),
                //         paramCreatedAt
                //     );

                // return Expression.Call(
                //     paramCreatedAt,
                //     call.MethodCallExpression
                // )

                // queryDate.CompareTo(artefact.CreatedAt)
                var comparison = Expression.Call(
                    typeof(DateTime).GetMethod("Compare"),
                    Expression.Constant(queryDate),
                    paramCreatedAt
                );

                if (isSince) 
                {
                    return Expression.GreaterThanOrEqual(
                        comparison, 
                        Expression.Constant(0)
                    );
                }
                else
                {
                    return Expression.LessThanOrEqual(
                        comparison, 
                        Expression.Constant(0)
                    );
                }
            }

            /* helper methods */

            // convert a query value list of form "&query=item1,item2,..."
            IList<string> QueryStringValueList(string queryStringListValue)
            {
                return queryStringListValue.Split(",");
            }

            // assumes 'vis != Visibility.Unspecified'
            bool VisQueryIsAuthorised(
                Visibility vis, 
                // current app user
                ApplicationUser curUser, 
                // &user=
                ApplicationUser queryUser)
            {
                switch (vis)
                {
                    case Visibility.Unspecified:
                        throw new ArgumentException(
                            "param. 'vis' cannot equal Visibility.Unspecified"
                        );
                    case Visibility.Public:
                        return true;
                    case Visibility.PrivateFamily:
                        if (queryUser == null || curUser == null)
                        {
                            return false;
                        }
                        else
                        {
                            return _userService.UsersAreFamily(curUser, queryUser);
                        }
                    case Visibility.Private:
                        if (queryUser == null || curUser == null)
                        {
                            return false;
                        }
                        else
                        {
                            return curUser.Id == queryUser.Id;
                        }
                    default:
                        // this should never be reached, notify
                        throw new InvalidOperationException("Unreachable code.");
                }
            }

            // convert a visString to an enum, throwing a QueryException if
            // string invalid
            Visibility VisStringQueryToEnum(string visString)
            {
                Visibility visEnum;
                if (Enum.TryParse(visString, true, out visEnum))
                {
                    if (visEnum == Visibility.Unspecified)
                    {
                        // user should not specify a 0 or null visibility value
                        ThrowVisQueryConversionException();
                        return Visibility.Unspecified;
                    }
                    else
                    {
                        return visEnum;
                    }
                }
                else
                {
                    // user did not specify a valid visibility query
                    ThrowVisQueryConversionException();
                    return Visibility.Unspecified;
                }

                void ThrowVisQueryConversionException()
                {
                    throw new QueryException
                    { 
                        IsQuery = true, 
                        Cause = 
                            $"Invalid visibility query '{visString}'",
                    };
                }
            }

            // Fold a number of lambdas with return type bool, 
            // using 'booleanBinOpExp'. 
            //
            // 'booleanBinOpExp' should evaluate to bool or things will break.
            //
            // It would be really cool if this was typed properly, but it's
            // just not practical right now.
            Expression FoldBoolLambdas(
                Expression start, // should be bool
                IEnumerable<Expression> boolLambdas,  // 
                Func<Expression, Expression, BinaryExpression> booleanBinOpExp)
            {
                // why this no work?
                // if (!(booleanBinOpExp.Conversion.ReturnType is bool))
                // {
                // }

                return boolLambdas
                    .Aggregate(
                        start,
                        (acc, whereLambda) => booleanBinOpExp(acc, whereLambda)
                    );
            }
        }

        public class QueryException : Exception
        {
            // the query is unauthorised
            public bool IsAuth { get; set; } = false;
            // the query is malformed in some manner
            public bool IsQuery { get; set; } = false;
            public string Cause { get; set; } = "";
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
