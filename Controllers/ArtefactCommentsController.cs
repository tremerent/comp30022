using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Artefactor.Data;
using Artefactor.Models;
using Microsoft.AspNetCore.Authorization;

using Artefactor.Services;
using Newtonsoft.Json;
using System.Collections;
using Microsoft.EntityFrameworkCore;

namespace Artefactor.Controllers
{
    public static class Constants
    {
        public static int fkConstraintCode = -2146232060;
    }

    [Route("api/artefacts/comments")]
    [ApiController]
    public class ArtefactCommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserService _userService;

        public ArtefactCommentsController(ApplicationDbContext context,
                                UserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetArtefactComments(
            [FromQuery] string artefactId
        )
        {
            var artefact = 
                await _context.Artefacts.SingleOrDefaultAsync(a => a.Id == artefactId);

            if (artefact == null)
            {
                return NotFound();
            }

            var artComments = _context.
                .Include(ac => ac.ChildComments)
                .Include(ac => ac.ParentComment)
                .Where(ac => ac.ArtefactId == artefactId);

            var rootComments = artComments.Where(ac => ac.ParentCommentId == null);

            return new JsonResult(rootComments);
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
                return new JsonResult(artComment);
            }
        }

        public class CommentPost
        {
            [JsonRequired]
            public string ArtefactId { get; set; }
            [JsonRequired]
            public string Body { get; set; }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddComment(
            [FromBody] CommentPost newComment)
        {
            var curUserId = _userService.GetCurUserId(HttpContext);

            var createdComment = new ArtefactComment
            {
                ArtefactId = newComment.ArtefactId,
                AuthorId = curUserId,
                Body = newComment.Body,
            };

            try 
            {
                await _context.AddAsync(createdComment);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                if (e.InnerException.HResult == Constants.fkConstraintCode)
                {
                    return NotFound(
                        $"'ArtefactId' '{newComment.ArtefactId}' does not exist.");
                }

                throw e;
            }

            return new JsonResult(createdComment);
        }

        // to post an 'answer', POST to 'reply' (method ReplyToComment)
        [HttpPost("question")]
        [Authorize]
        public async Task<IActionResult> AddQuestion(
            [FromBody] CommentPost newQuestion)
        {
            var curUserId = _userService.GetCurUserId(HttpContext);

            var art = await _context
                .Artefacts
                .SingleOrDefaultAsync(a => a.Id == newQuestion.ArtefactId);

            if (art == null)
            {
                return NotFound();
            }
            if (art.OwnerId != curUserId)
            {
                return Unauthorized("Only the artefact owner can post a question.");
            }

            var createdQuestion = new ArtefactQuestion
            {
                ArtefactId = newQuestion.ArtefactId,
                AuthorId = curUserId,
                Body = newQuestion.Body,

                IsAnswered = false,
            };

            try 
            {
                await _context.AddAsync(createdQuestion);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                if (e.InnerException.HResult == Constants.fkConstraintCode)
                {
                    return NotFound(
                        $"'ArtefactId' '{newQuestion.ArtefactId}' does not exist.");
                }

                throw e;
            }

            return new JsonResult(createdQuestion);
        }
        class QuestionAnswer
        {
            public string QuestionId { get; set; }
            public string AnswerId { get; set; }

        }

        [HttpDelete("mark-answer")]
        public async Task<IActionResult> DeleteMarkedAnswer(
            [FromBody] deleteMarkedAnswer
        )
        {
            
        }

        [HttpPost("mark-answer")]
        [Authorize]
        public async Task<IActionResult> MarkAnswer(
            [FromBody] QuestionAnswer markAnswer)
        {
            var curUserId = _userService.GetCurUserId(HttpContext);

            var art = await _context
                .Artefacts
                .SingleOrDefaultAsync(a => a.Id == markAnswer.QuestionId);

            // get the question
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

            // add the new answer
            question.AnswerCommentId = markAnswer.AnswerId;
            question.IsAnswered = true;

            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                if (e.InnerException.HResult == Constants.fkConstraintCode)
                {
                    return NotFound(
                        $"Question answer '{markAnswer.AnswerId}' does not exist.");
                }

                throw e;
            }

            return new NoContentResult();
        }

        public class CommentReplyPost
        {
            [JsonRequired]
            public string ParentCommentId { get; set; }
            [JsonRequired]
            public string Body { get; set; }
        }

        [HttpPost("reply")]
        public async Task<IActionResult> ReplyToComment(
            [FromBody] CommentReplyPost reply)
        {
            ArtefactComment replyingTo = _context.ArtefactComments
                .SingleOrDefault(c => c.Id == reply.ParentCommentId);

            if (replyingTo == null)
            {
                return NotFound();
            }

            var curUserId = _userService.GetCurUserId(HttpContext);

            var newCommentReply = new ArtefactComment
            {
                Body = reply.Body,
                ArtefactId = replyingTo.ArtefactId,
                AuthorId = curUserId,
                ParentCommentId = replyingTo.Id,
            };

            await _context.AddAsync(newCommentReply);
            await _context.SaveChangesAsync();

            return new JsonResult(newCommentReply);
        }
    }
}
