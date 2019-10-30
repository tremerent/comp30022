using System;
using System.Linq;
using System.Threading.Tasks;
using Artefactor.Data;
using Artefactor.Models;
using Artefactor.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Artefactor.Controllers
{
    /** Controller for user profile actions. */

    [Authorize]
    [Route("api/user")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UploadService _uploadService;
        private readonly UserService _userService;

        public ProfileController(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            UploadService uploadService,
            UserService userService)
        {
            _context = context;
            _userManager = userManager;
            _uploadService = uploadService;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpGet("{username}")]
        public async Task<IActionResult> Get(string username)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserName == username);

            var answerCount = _context
                .ArtefactQuestions
                .Where(q => q.IsAnswered 
                       && q.AnswerComment.Author.UserName == username)
                .Count();

            if (user != null)
            {
                return new JsonResult(new
                {
                    id = user.Id,
                    username = user.UserName,
                    bio = user.Bio,
                    imageUrl = user.ImageUrl,
                    newUser = user.NewUser,
                    answerCount,
                });
            }
            else
            {
                return NotFound();
            }
        }

        public class ProfileUpdate
        {
            public string bio;
            public string image_url;
            public bool? newUser;
        }

        [HttpPatch("{username}")]
        public async Task<IActionResult> EditProfile([FromRoute] string username, [FromBody] ProfileUpdate diff)
        {
            ApplicationUser curUser =
                await _userService.GetCurUser(HttpContext);

            if (curUser == null || curUser.UserName != username)
            {
                return Unauthorized();
            }

            _context.Attach(curUser);

            if (diff.bio != null)  {
                curUser.Bio = diff.bio;
            }
            if (diff.image_url != null)
                curUser.ImageUrl = diff.image_url;

            if (diff.newUser.HasValue)
                curUser.NewUser = diff.newUser.Value;

            await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                curUser.Id,
                curUser.UserName,
                curUser.Bio,
                curUser.ImageUrl,
                curUser.NewUser,
            });
        }

        [HttpPost("display-picture")]
        public async Task<IActionResult> SetProfileImage(IFormFile file)
        {
            ApplicationUser curUser =
                await _userService.GetCurUser(HttpContext);

            if (curUser == null)
            {
                return Unauthorized();
            }

            Uri uri = await _uploadService.UploadFileToBlobAsync(
                file.FileName, file, ContainerType.ProfileImage);

            await EditProfile(
                curUser.UserName, 
                new ProfileUpdate { image_url = uri.AbsoluteUri }
            );

            return new JsonResult(new
            {
                url = uri.AbsoluteUri
            });
        }
    }
}
