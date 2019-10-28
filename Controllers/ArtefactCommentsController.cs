using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Artefactor.Data;
using Artefactor.Models;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;

using Artefactor.Services;
using Artefactor.Services.Converters;

namespace Artefactor.Controllers
{
    [Route("api/artefacts/comments")]
    [ApiController]
    public class ArtefactCommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserService _userService;
        private readonly IConverter<ArtefactComment> _converter;

        public ArtefactCommentsController(ApplicationDbContext context,
            UserService userService,
            IConverter<ArtefactComment> converter)
        {
            _context = context;
            _userService = userService;
            _converter = converter;
        }

        // Return all comments of 'artefactId' as a json tree.
        [HttpGet]
        public async Task<IActionResult> GetArtefactComments(
            [FromQuery] string artefactId
        )
        {
            var artefact = await _context
                .Artefacts
                .SingleOrDefaultAsync(a => a.Id == artefactId);
            if (artefact == null)
            {
                return NotFound();
            }

            // Load all comments with their children. We recursively
            // attach the next levels, starting at the artefact's root comments.

            var artComments = await _context
                .ArtefactComments
                .Where(ac => ac.ArtefactId == artefactId)
                .Include(ac => ac.ChildComments)
                .Include(ac => ac.Author)
                .ToListAsync();

            return new JsonResult(artComments.Select(c => _converter.ToJson(c)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComment(string id)
        {
            var artComment = _context.ArtefactComments
                .Include(comments => comments.ChildComments)
                .Include(comments => comments.Author)
                .SingleOrDefault(ac => ac.Id == id);

            if (artComment == null)
            {
                return NotFound();
            }
            else
            {
                return new JsonResult(_converter.ToJson(artComment));
            }
        }

        public class CommentPost
        {
            [JsonRequired]
            public string ArtefactId { get; set; }
            [JsonRequired]
            public string Body { get; set; }
        }

        // Add a comment to an artefact.
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddComment(
            [FromBody] CommentPost newComment)
        {
            var curUser = await _userService.GetCurUser(HttpContext);

            var createdComment = new ArtefactComment
            {
                ArtefactId = newComment.ArtefactId,
                AuthorId = curUser.Id,
                Author = curUser,
                Body = newComment.Body,
                CreatedAt = System.DateTime.UtcNow,
            };

            try
            {
                await _context.AddAsync(createdComment);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                var sqlError = Helpers.GetSqlError((SqlException) e.GetBaseException());
                switch (sqlError.Number) {
                    case 547: // fk violation
                        return NotFound($"Artefact '{newComment.ArtefactId}' does not exist.");
                    default:
                        throw;
                }
            }

            return new JsonResult(_converter.ToJson(createdComment));
        }

        public class CommentReplyPost
        {
            [JsonRequired]
            public string ParentCommentId { get; set; }
            [JsonRequired]
            public string Body { get; set; }
        }

        // Add a reply to an already existing comment.
        [HttpPost("reply")]
        [Authorize]
        public async Task<IActionResult> ReplyToComment(
            [FromBody] CommentReplyPost reply)
        {
            ArtefactComment replyingTo = _context.ArtefactComments
                .SingleOrDefault(c => c.Id == reply.ParentCommentId);
            if (replyingTo == null)
            {
                return NotFound();
            }

            var curUser = await _userService.GetCurUser(HttpContext);

            var newCommentReply = new ArtefactComment
            {
                Body = reply.Body,
                ArtefactId = replyingTo.ArtefactId,
                AuthorId = curUser.Id,
                Author = curUser,
                ParentCommentId = replyingTo.Id,
                CreatedAt = System.DateTime.UtcNow,
            };

            // no need to catch the fk error - already checked for 404
            await _context.AddAsync(newCommentReply);
            await _context.SaveChangesAsync();

            return new JsonResult(_converter.ToJson(newCommentReply));
        }

        // Add a question to an artefact.
        // To post an 'answer', POST to 'reply' (method ReplyToComment)
        [HttpPost("question")]
        [Authorize]
        public async Task<IActionResult> AddQuestion(
            [FromBody] CommentPost newQuestion)
        {
            var curUser = await _userService.GetCurUser(HttpContext);

            // veryify answer
            var art = await _context
                .Artefacts
                .SingleOrDefaultAsync(a => a.Id == newQuestion.ArtefactId);
            if (art == null)
            {
                return NotFound($"'ArtefactId' '{newQuestion.ArtefactId}' does not exist.");
            }
            if (art.OwnerId != curUser.Id)
            {
                return Unauthorized("Only the artefact owner can post a question.");
            }

            var createdQuestion = new ArtefactQuestion
            {
                ArtefactId = newQuestion.ArtefactId,
                AuthorId = curUser.Id,
                Author = curUser,
                Body = newQuestion.Body,
                CreatedAt = System.DateTime.UtcNow,
                IsAnswered = false,
                AnswerCommentId = null,
            };

            // no need to catch the fk error - already checked for 404
            await _context.AddAsync(createdQuestion);
            await _context.SaveChangesAsync();

            return new JsonResult(_converter.ToJson(createdQuestion));
        }
        public class MarkAnswer
        {
            public string QuestionId { get; set; }
            public string AnswerId { get; set; }
        }

        // Mark a comment as the 'answer' to a question. This creates reference
        // 'ArtefactQuestion.AnswerId' and sets 'ArtefactQuestion.IsAnswered'.
        //
        // These should possibly be LINK - UNLINK, but unsupported.
        [HttpPatch("mark-answer")]
        [Authorize]
        public async Task<IActionResult> MarkAsAnswered(
            [FromBody] MarkAnswer markAnswer)
        {
            var curUserId = _userService.GetCurUserId(HttpContext);

            // verify question
            var question = await _context.ArtefactQuestions
                    .SingleOrDefaultAsync(q => q.Id == markAnswer.QuestionId);
            if (question == null)
            {
                return NotFound($"Question '{markAnswer.QuestionId}' does not exist.");
            }
            if (question.AuthorId != curUserId)
            {
                return Unauthorized("Only question owner can mark the question as answered.");
            }

            // verify answer
            var answer = await _context.ArtefactComments
                    .SingleOrDefaultAsync(q => q.Id == markAnswer.AnswerId);
            if (answer == null)
            {
                return NotFound($"Question '{markAnswer.AnswerId}' does not exist.");
            }
            if (answer.ParentCommentId != question.Id)
            {
                return BadRequest($"Comment {markAnswer.AnswerId} does not " +
                                  $"have parent {markAnswer.QuestionId}.");
            }

            // mark question as answered
            question.AnswerCommentId = markAnswer.AnswerId;
            question.IsAnswered = true;

            await _context.SaveChangesAsync();

            return new NoContentResult();
        }

        [HttpDelete("mark-answer")]
        [Authorize]
        public async Task<IActionResult> RemoveMarkedAnswer(
            [FromBody] MarkAnswer removeMarkAnswer)
        {
            var curUserId = _userService.GetCurUserId(HttpContext);

            var question = await _context.ArtefactQuestions
                .SingleOrDefaultAsync(q => q.Id == removeMarkAnswer.QuestionId);

            if (question == null)
            {
                return NotFound($"Question '{removeMarkAnswer.QuestionId}' does not exist");
            }
            if (question.AnswerCommentId != removeMarkAnswer.AnswerId)
            {
                return BadRequest($"Question '{removeMarkAnswer.QuestionId}' " +
                        $"does not have answer '{removeMarkAnswer.AnswerId}'");
            }

            question.IsAnswered = false;
            question.AnswerCommentId = null;
            await _context.SaveChangesAsync();

            return new NoContentResult();
        }
    }
}
