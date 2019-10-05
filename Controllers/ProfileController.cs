using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Artefactor.Data;
using Artefactor.Models;
using Artefactor.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Artefactor.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/<controller>
        [AllowAnonymous]
        [HttpGet("{username}")]
        public async Task<IActionResult> Get(string username)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserName == username);

            if (user != null)
            {
                return new JsonResult(new
                {
                    id = user.Id,
                    username = user.UserName,
                    bio = user.Bio,
                    image_url = user.ImageUrl,
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
        }

        // POST api/<controller>
        [Authorize]
        [HttpPost("{username}")]
        public async Task<IActionResult> EditProfile([FromRoute] string username, [FromBody] ProfileUpdate diff)
        {
            ApplicationUser curUser =
                await UserService.GetCurUser(HttpContext, _userManager);

            if (curUser == null || curUser.UserName != username)
            {
                return Unauthorized();
            }

            _context.Attach(curUser);

            if (diff.bio != null)  {
                Console.WriteLine("HERE");
                curUser.Bio = diff.bio;
            }
            if (diff.image_url != null)
                curUser.ImageUrl = diff.image_url;

            await _context.SaveChangesAsync();

            return new JsonResult(new
            {
                curUser.Id,
                curUser.UserName,
                curUser.Bio,
                curUser.ImageUrl,
            });
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
