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
            // Artefact commentingOn = _context.Artefacts
            //     .SingleOrDefault(a => a.Id == newComment.ArtefactId);

            var curUserId = _userService.GetCurUserId(HttpContext);

            // if (commentingOn == null)
            // {
            //     return NotFound();
            // }

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
            catch (Exception e)
            {
                throw e;
            }

            IQueryable<ArtefactComment> artefactComments = _context.ArtefactComments;

            var found = artefactComments.SingleOrDefault(comment => comment.Id == createdComment.Id);

            return new JsonResult(createdComment);
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
