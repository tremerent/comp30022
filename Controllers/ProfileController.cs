using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Artefactor.Data;
using Artefactor.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Artefactor.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ProfileController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/<controller>
        [AllowAnonymous]
        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(string userId)
        {
            var user = _context.Users.SingleOrDefault(u => u.Id == userId);

            if (user != null)
            {
                return new JsonResult(new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    bio = user.Bio,
                });
            }
            else
            {
                return NotFound();
            }
        }

        // POST api/<controller>
        [HttpPost]
        public void Post([FromBody]string value)
        {
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
