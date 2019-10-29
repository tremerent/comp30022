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
using System.Reflection;

using Artefactor.Services;
using Artefactor.Services.Converters;
using Artefactor.Shared;

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
                .Select(eVal => Helpers.GetAttributeOfType<EnumMemberAttribute>(eVal))
                .Where(enumMemberAttrib => enumMemberAttrib != null)
                .Select(enumMemberAttrib => enumMemberAttrib.Value)
                .ToList();

            return visValsEnumMemberAttribs;

        }

        [HttpGet]
        public async Task<ActionResult> GetArtefacts(
            [FromQuery] string id,

            [FromQuery] string user,

            [FromQuery] string[] q,  // query by string
            [FromQuery] bool? includeDesc,

            [FromQuery] Visibility[] vis,  // eg. ...&vis=public,private&...

            [FromQuery] string[] category,
            [FromQuery] bool? matchAll,

            [FromQuery] DateTime since,
            [FromQuery] DateTime until,

            [FromQuery] string sort)
        {
            // Iterate through query params, adding lambdas of type
            // 'System.Linq.Expression'.
            //
            // Their conjunction is applied ie. 'artefact.Where(conj)'
            //
            // Similar expressions are built for calls to '.OrderBy'.

            IQueryable<Artefact> artefacts =
                _context.Artefacts
                        .Include(a => a.CategoryJoin)
                            .ThenInclude(cj => cj.Category)
                        .Include(a => a.Owner)
                        .Include(a => a.Images)
                        .Include(a => a.Comments);
            ApplicationUser curUser = await _userService.GetCurUser(HttpContext);

            // if querying for a single artefact, simply return that artefact
            if (id != null)
            {
                var artefact = await artefacts
                    .SingleOrDefaultAsync(a => a.Id == id);

                if (artefact == null)
                {
                    return NotFound();
                }

                // check auth

                if (Queries.QueryIsAuthorised(
                    artefact.Visibility,
                    curUser,
                    artefact.Owner,
                    (curUser, queryUser) => curUser.Id == queryUser.Id,
                    (curUser, queryUser) => true  // just one big happy family
                ))

                return new JsonResult(_artefactConverter.ToJson(artefact));
            }

            /// Build dynamic linq queries using expression trees. See -
            /// https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/expression-trees/how-to-use-expression-trees-to-build-dynamic-queries

            ParameterExpression artefactParam =
                Expression.Parameter(typeof(Artefact), "artefact");

            IList<Expression> whereLambdas = new List<Expression>();
            IList<Expression> orderByLambdas = new List<Expression>();

            // first initialise queryUser - check for NotFound

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

            if (vis != null && vis.Length > 0)
            {
                if (vis.Any(visQuery => !Queries.QueryIsAuthorised(
                        visQuery,
                        curUser,
                        queryUser,
                        (curUser, queryUser) => curUser.Id == queryUser.Id,
                        (curUser, queryUser) => true  // just one big happy family
                    )))
                {
                    return Unauthorized();
                }
                else
                {
                    var visLambdas = new List<Expression>(
                        Enum.GetValues(typeof(Visibility)).Length
                    );

                    foreach(Visibility visQuery in vis)
                    {
                        visLambdas.Add(
                            QueryExpressions.ArtefactVisQueryExpression(visQuery, artefactParam)
                        );
                    }

                    // OR visibilities since artefact can belong to any of the
                    // queried visibilities
                    whereLambdas.Add(
                        QueryExpressions.FoldBoolLambdas(
                            Expression.Constant(false),
                            visLambdas,
                            (lamb1, lamb2) => Expression.OrElse(lamb1, lamb2))
                    );
                }
            }
            else
            {
                // no vis query has been specified, so just return public
                // artefacts and consider other queries
                whereLambdas.Add(
                    QueryExpressions.ArtefactVisQueryExpression(
                        Visibility.Public, artefactParam)
                );
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
                        QueryExpressions.ArtefactVisQueryExpression(
                            Visibility.Public, artefactParam)
                    );
                }

                whereLambdas.Add(
                    QueryExpressions.ArtefactUserQueryExpression(queryUser.Id, artefactParam)
                );

            }
            else
            {
                // no user was specified and vis. authorisation has already
                // been applied - so just filter to see only public
                whereLambdas.Add(
                    QueryExpressions.ArtefactVisQueryExpression(
                        Visibility.Public, artefactParam)
                );
            }

            // query string query

            if (q != null && q.Length > 0)
            {
                try {
                    for (int i = 0; i < q.Length; i++) ProcessQuery(q[i]);
                }
                catch (Exception e) {
                    if (e is QueryException) {
                        return BadRequest("Badly formatted query 'q'");
                    }
                    else if (e is ArgumentException) {
                        return BadRequest("Badly formatted query 'q'");
                    }
                    else {
                        throw;
                    }
                }

                void ProcessQuery(string query)
                {
                    var (queryText, queryProperty) = SplitQuery(query);

                    if (!IsValidQueryProperty(queryProperty)) {
                        throw new QueryException { IsQuery = true };
                    }

                    var propertyName =
                        ApiQueryPropertyToPropertyName(queryProperty);

                    whereLambdas.Add(
                        QueryExpressions.ArtefactStrQueryExpression(
                            queryText, propertyName, artefactParam
                        )
                    );

                    bool IsValidQueryProperty(string queryProperty)
                    {
                        return (queryProperty != null) ||
                               (queryProperty == "title") ||
                               (queryProperty == "description");
                    }

                    string ApiQueryPropertyToPropertyName(string apiQueryProperty) {
                        if (apiQueryProperty == "title") {
                            return "Title";
                        }
                        else if (apiQueryProperty == "description") {
                            return "Description";
                        }
                        else {
                            throw new ArgumentException();
                        }
                    }
                }

                // (queryText, queryProperty)
                (string, string) SplitQuery(string query)
                {
                    var split = query.Split(':');

                    var queryText = split[0];
                    string queryProperty;  // Artefact property to be queried
                    if (split.Length > 1)
                    {
                        queryProperty = split[1];
                    }
                    else
                    {
                        queryProperty = null;
                    }

                    return (queryText, queryProperty);
                }

            }

            // categories query

            if (category != null && category.Length > 0)
            {
                var categoryLambdas = category
                    .Select(cat => QueryExpressions.CategoryQueryExpression(cat, artefactParam));

                Expression categoryLambdasJoined;

                // if matchAll, artefact must belong to every category in query
                // 'category'
                if (matchAll.HasValue && matchAll.Value) {
                    categoryLambdasJoined = QueryExpressions.FoldBoolLambdas(
                        (Expression) Expression.Constant(true),
                        categoryLambdas,
                        Expression.AndAlso
                    );
                }
                else {
                    categoryLambdasJoined = QueryExpressions.FoldBoolLambdas(
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
                return date.CompareTo(default(DateTime)) != 0;
            }

            if (since != null && isSpecified(since))
            {
                whereLambdas.Add(
                    QueryExpressions.ArtefactCreatedAtQueryExpression(
                        since,
                        true,
                        artefactParam
                    )
                );
            }
            if (until != null && isSpecified(until))
            {
                whereLambdas.Add(
                    QueryExpressions.ArtefactCreatedAtQueryExpression(
                        until,
                        false,
                        artefactParam
                    )
                );
            }

            // Query param lambda have been appended to 'whereLambdas'.
            // Take conjunction, then call with Where.

            Expression whereLambdasAnded = QueryExpressions.FoldBoolLambdas(
                (Expression) Expression.Constant(true),
                whereLambdas,
                Expression.AndAlso
            );

            Expression whereCallExpression = QueryExpressions.GetWhereExp<Artefact>(
                whereLambdasAnded,
                artefactParam,
                artefacts
            );

            // Where applied - build 'OrderBy' lambda

            Expression finalExpr = whereCallExpression;

            // sort queries

            if (sort != null)
            {
                var split = sort.Split(':');

                var sortBy = split[0];
                string sortOrder;
                if (split.Length > 1)
                {
                    sortOrder = split[1];
                }
                else
                {
                    sortOrder = "asc";
                }

                Expression orderByBodyExp;
                Type orderType = typeof(string);  // type of second in a => a.asdasd

                // get the order by body - ie. OrderBy(orderByBodyExp)
                switch (sortBy)
                {
                    case "title":
                        orderType = typeof(string);

                        orderByBodyExp = QueryExpressions.ArtefactPropertyExpression<string>(
                            "Title", artefactParam);

                        break;
                    case "createdAt":
                        orderType = typeof(DateTime);

                        orderByBodyExp = QueryExpressions.ArtefactPropertyExpression<DateTime>(
                            "CreatedAt", artefactParam);
                        break;

                    // TODO(jonah)

                    case "questionCount":
                        orderType = typeof(int);

                        var commentsPropertyExpQ =
                            QueryExpressions.ArtefactPropertyExpression<IEnumerable<ArtefactComment>>(
                                "Comments",
                                artefactParam
                            );

                        var ofTypeMethod =
                            typeof(Enumerable)
                            .GetMethods()
                            .Single(method => method.Name == "OfType" &&
                                    method.IsStatic &&
                                    method.GetParameters().Length == 1);

                        var questionsExp = Expression.Call(
                            ofTypeMethod.MakeGenericMethod(typeof(ArtefactQuestion)),
                            commentsPropertyExpQ
                        );

                        orderByBodyExp = QueryExpressions
                            .CountExpression<ArtefactQuestion>(questionsExp);

                        break;

                    case "commentCount":
                        orderType = typeof(int);

                        var commentsPropertyExp = QueryExpressions
                            .ArtefactPropertyExpression<IEnumerable<ArtefactComment>>(
                                "Comments",
                                artefactParam
                            );

                        orderByBodyExp = QueryExpressions
                            .CountExpression<ArtefactComment>(commentsPropertyExp);
                        break;

                    case "imageCount":

                        orderType = typeof(int);

                        var imagePropertyExp =
                            QueryExpressions.ArtefactPropertyExpression<IEnumerable<ArtefactDocument>>(
                                "Images",
                                artefactParam
                            );

                        orderByBodyExp = QueryExpressions.CountExpression<ArtefactDocument>(imagePropertyExp);

                        break;

                    default:
                        return BadRequest($"Invalid sort query '{sortBy}'");
                }

                // Set 'finalExpr' since 'OrderBy(..)' instance is
                // 'artefacts.Where(..)'.

                if (sortOrder == "asc")
                {
                    finalExpr = MakeOrderByExp(false);
                }
                else if (sortOrder == "desc")
                {
                    finalExpr = MakeOrderByExp(true);
                }
                else
                {
                    return BadRequest($"Invalid sort query order '${sortOrder}'");
                }

                MethodCallExpression MakeOrderByExp(bool isDesc)
                {
                    MethodInfo GetOrderByExpression_MethInfo =
                        typeof(Artefactor.Shared.QueryExpressions)
                        .GetMethod("GetOrderByExp");

                    object orderByCallExpression =
                        GetOrderByExpression_MethInfo
                        .MakeGenericMethod(typeof(Artefact), orderType)
                        .Invoke(this, new object[] {
                            whereCallExpression,
                            orderByBodyExp,
                            artefactParam,
                            isDesc
                        });

                    T Cast<T>(object entity) where T : class
                    {
                        return entity as T;
                    }

                    return Cast<MethodCallExpression>(orderByCallExpression);
                }
            }

            // finally, compile and return results

            IQueryable<Artefact> results =
                artefacts.Provider.CreateQuery<Artefact>(finalExpr);

            return new JsonResult(
                (await results.ToListAsync())
                .Select(a => _artefactConverter.ToJson(a))
            );
        }

        // POST: api/Artefacts
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Artefact>> PostArtefact(Artefact artefact)
        {
            // it would be better design to just return id, but clients
            // may need owner username
            var curUser = await _userService.GetCurUser(HttpContext);

            _context.Add(artefact);

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

        public class EditArtefactReq {
            [JsonRequired]
            public string Id { get; set; }
            public string Title { get; set; }
            [JsonConverter(typeof(StringEnumConverter))]
            public Visibility Visibility { get; set; }
            public string Description { get; set; }

            public class CategoryJoinReq
            {
                [JsonRequired]
                public string CategoryId { get; set; }
                public string ArtefactId { get; set; }
            }
        }

        // PATCH: api/Artefacts/as23-123
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> EditArtefact(string id, EditArtefactReq artefact)
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

            foreach (var  patchProperty in artefact.GetType().GetProperties())
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
            var curUserId = _userService.GetCurUserId(HttpContext);

            var artefact = await _context.Artefacts.FindAsync(id);
            if (artefact == null)
            {
                return NotFound();
            }
            else if (artefact.OwnerId != curUserId) 
            {
                return Unauthorized();
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

                var artDoc = new ArtefactDocument
                {
                    Title = file.FileName,
                    Url = uri.AbsoluteUri,
                    ArtefactId = artefactId,
                    DocType = DocType.Image,
                };

                await _context.AddAsync(artDoc);

                await _context.SaveChangesAsync();

                // todo - use converter
                return new JsonResult(new {
                    id      = artDoc.Id,
                    title   = artDoc.Title,
                    url     = artDoc.Url,
                    type    = artDoc.DocType,
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.ToString());
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
