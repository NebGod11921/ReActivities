using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace API.Controllers
{
    public class AccountController(SignInManager<User> signIn, IEmailSender<User> 
        emailSender, IConfiguration config) : BaseApiController
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


            if (result.Succeeded)
            {
                await SendConfirmationEmailAsync(user, registerDTO.Email);


                return Ok("User registered successfully.");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        [AllowAnonymous]
        [HttpGet("resendConfirmEmail")]
        public async Task<ActionResult> ResendConfirmationEmail(string email)
        {
            var user = await signIn.UserManager.Users
                .FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return BadRequest("Invalid email");
            await SendConfirmationEmailAsync(user, email);
            return Ok();

        }



        private async Task SendConfirmationEmailAsync(User user, string email)
        {
            var code = await signIn.UserManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            var confirmEmailUrl = $"{config["ClientAppUrl"]}/confirm-email?userId={user.Id}&code={code}";
        
            await emailSender.SendConfirmationLinkAsync(user, email, confirmEmailUrl);

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
                user.Id,
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
