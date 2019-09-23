using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Artefactor.Models;

namespace Artefactor.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> um)
        {
            _userManager = um;
        }

        // GET: api/user?username=<username>
        [HttpGet]
        public async Task<ActionResult<ApplicationUser>> GetProfile(
                [FromQuery] string username
            )
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) {
                return new JsonResult(new {
                    ok = false,
                    error = "No user with that username."
                });
            }

            return new JsonResult(new {
                ok = true,
                user = new {
                    user = user.UserName,
                    bio = user.Biography,
                    artefactCount = user.ArtefactCount
                }
            });
        }
    }
}

