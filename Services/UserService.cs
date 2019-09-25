using Artefactor.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Artefactor.Services
{
    public class UserService
    {
        /**
         * UserManager<ApplicationUser>.GetUserAsync requires additional
         * IdentityServer config - however 'sub' of JWT stores userId, 
         * and is added to the context's User claim 'NameIdentifier'.
         */
        public static string GetCurUserId(HttpContext httpContext)
        {
            return httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // TODO: userManager should really be injected here (and UserService made not static)
        public static async Task<ApplicationUser> GetCurUser(HttpContext httpContext, 
            UserManager<ApplicationUser> userManager)
        {
            var curUserId = GetCurUserId(httpContext);

            if (curUserId != null)
            {
                return await userManager.FindByIdAsync(curUserId);
            }

            return null;
        }
    }
}
