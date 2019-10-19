using Artefactor.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Artefactor.Services
{
    public class UserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        /**
         * UserManager<ApplicationUser>.GetUserAsync requires additional
         * IdentityServer config - however 'sub' of JWT stores userId, 
         * and is added to the context's User claim 'NameIdentifier'.
         */
        public string GetCurUserId(HttpContext httpContext)
        {
            return httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // TODO: userManager should really be injected here (and UserService made not static)
        public async Task<ApplicationUser> GetCurUser(HttpContext httpContext)
        {
            var curUserId = GetCurUserId(httpContext);

            if (curUserId != null)
            {
                return await _userManager.FindByIdAsync(curUserId);
            }

            return null;
        }

        // Returns true if user attached to 'context' is user with id 'userId' or 'username'.
        // 
        // TODO: would be better to have this as a custom policy -
        // https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-3.0
        //
        // Eg. IsCurUser(null, "bob", HttpContext)
        public async Task<bool> IsCurUser(string userId, string username, HttpContext context)
        {
            ApplicationUser curUser = await GetCurUser(context);

            // throw if there is no current user attached to 'context'
            if (curUser == null)
            {
                throw new ArgumentException("No current user.");
            }

            if (userId != null)
            {
                return curUser.Id == userId;
            }
            else if (username != null)
            {
                var userWithUsername = await _userManager.FindByNameAsync(username);

                return curUser.Id == userWithUsername.Id;
            }
            // throw if both 'userId' and 'username' are null
            else
            {
                throw new ArgumentNullException("Supply a non-null user to compare against.");
            }
        }

        public bool UsersAreFamily(ApplicationUser user1, ApplicationUser user2)
        {
            // just one big happy family
            return true;
        }
    }
}
