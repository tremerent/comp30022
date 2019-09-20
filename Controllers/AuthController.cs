using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Artefactor.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Artefactor.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(SignInManager<ApplicationUser> signInManager, 
            UserManager<ApplicationUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public class LoginRequest
        {
            [Required]
            public string Username { get; set; }

            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
            public string ReturnUrl { get; set; }
        }

        public class RegisterRequest
        {
            [Required]
            public string Username { get; set; }
            public string Email { get; set; }

            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }
            [Required]
            [DataType(DataType.Password)]
            public string ConfirmPassword { get; set; }

        }

        // GET: api/<controller>
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequest loginReq, string returnUrl = null)
        {
            if (true)  // validate input
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var user = await _userManager.FindByNameAsync(loginReq.Username);

                // todo
                if (user == null)
                {
                    return Unauthorized();
                }

                var result = await _signInManager.PasswordSignInAsync(user, loginReq.Password, loginReq.RememberMe, lockoutOnFailure: true);
                if (result.Succeeded)
                {
                    if (returnUrl != null)
                    {
                        return new JsonResult(new
                        {
                            RedirectUrl = loginReq.ReturnUrl,
                            IsOk = true,
                            user = new { user.UserName }
                        });
                    }
                    else
                    {
                        return LocalRedirect(returnUrl);
                    }
                    
                }
                if (result.RequiresTwoFactor)
                {
                    return Unauthorized();
                    //return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, RememberMe = Input.RememberMe });
                }
                if (result.IsLockedOut)
                {
                    return Unauthorized();
                    //return RedirectToPage("./Lockout");
                }
                else
                {
                    //ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    return Unauthorized();
                }
            }
            else
            {
                // todo
                return new BadRequestObjectResult("Malformed body");
            }
        }

        

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterRequest registerReq, 
            string returnUrl = null)
        {
            if (true)  // validate
            {
                ApplicationUser user;

                user = new ApplicationUser { UserName = registerReq.Username, };

                var result = await _userManager.CreateAsync(user, registerReq.Password);

                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    var resp = new JsonResult(new
                    {
                        IsOk = true,
                        user = new { user.UserName },
                    });

                    return JsonRespIfNoRedir(resp, returnUrl);
                }
                else
                {
                    JsonResult resp;

                    // cherry pick error codes handled by client

                    var dupUsernameError = result
                        .Errors
                        .SingleOrDefault(e => e.Code == "DuplicateUserName");

                    if (dupUsernameError != null)
                    {
                        resp = new JsonResult(new
                        {
                            IsOk = false,
                            errorCode = dupUsernameError.Code,
                        });
                    }
                    else
                    {
                        // TODO
                        resp = new JsonResult(new
                        {
                            IsOk = false,
                            errorCode = "Other",
                        });
                    }

                    return resp;
                }
            }
            else
            {
                // todo
                return new BadRequestObjectResult("Malformed body");
            }
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout(string returnUrl = null)
        {
            await _signInManager.SignOutAsync();

            var resp = new JsonResult(new
            {
                IsOk = true
            });

            return JsonRespIfNoRedir(resp, returnUrl);
        }

        private IActionResult JsonRespIfNoRedir(Object jsonObj, 
            string returnUrl = null)
        {
            if (returnUrl != null)
            {
                return LocalRedirect(returnUrl);
            }
            else
            {
                return new JsonResult(jsonObj);
            }
        }
    }
}
