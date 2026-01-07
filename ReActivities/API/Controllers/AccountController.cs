using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(SignInManager<User> signIn) : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(RegisterDTO registerDTO)
        {
            // Registration logic will go here
            var user = new User
            {
                UserName = registerDTO.Email,
                Email = registerDTO.Email,
                DisplayName = registerDTO.DisplayName
            };
            var result = await signIn.UserManager.CreateAsync(user, registerDTO.Password);


            if (result.Succeeded == true)
            {
                return Ok("User registered successfully.");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        [AllowAnonymous]
        [HttpGet("user-info")]
        public async Task<IActionResult> GetUserInfo()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return NoContent();

            var user = await signIn.UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                user.DisplayName,
                user.UserName,
                user.Email,
                user.ImageUrl
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await signIn.SignOutAsync();
            return Ok();
        }
    }
}
