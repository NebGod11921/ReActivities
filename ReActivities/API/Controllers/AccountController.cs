using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Net.Http.Headers;
using System.Text;
using static API.DTOs.GitHubInfo;

namespace API.Controllers
{
    public class AccountController(SignInManager<User> signIn, IEmailSender<User> 
        emailSender, IConfiguration config) : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost("github-login")]
        public async Task<ActionResult> LoginWithGithub(string code)
        {
            if(string.IsNullOrEmpty(code))
                return BadRequest("Missing authorization");
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //step 1: exchange code for access token
            var tokenResponse = await httpClient.PostAsJsonAsync("https://github.com/login/oauth/access_token",
                new GitHubAuthRequest
                {
                    Code = code,
                    ClientId = config["Authenticaiton:GitHub:ClientId"]!,
                    ClientSecret = config["Authenticaiton:GitHub:ClientSecret"]!,
                    RedirectUri = $"{config["ClientAppUrl"]}/auth-callback"
                });

            if(!tokenResponse.IsSuccessStatusCode)
                return BadRequest("Error exchanging code for access token");

            var tokenContent = await tokenResponse.Content.ReadFromJsonAsync<GitHubTokenResponse>();

            if(string.IsNullOrEmpty(tokenContent?.AccessToken))
                return BadRequest("Failed to retrieve access token");

            //step 2 - fetch usr info from GitHub
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenContent.AccessToken);
            httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Reactivities");

            var userResponse = await httpClient.GetAsync("https://api.github.com/user");

            if(!userResponse.IsSuccessStatusCode)
                return BadRequest("Error fetching user info from GitHub");

            var user = await userResponse.Content.ReadFromJsonAsync<GitHubUser>();
            if(user == null)
                return BadRequest("Failed to read user info from GitHub");

            //step 3 - getting the email needed
            if (string.IsNullOrEmpty(user?.Email))
            {
                var emailResponse = await httpClient.GetAsync("https://api.github.com/user/emails");
                if(emailResponse.IsSuccessStatusCode)
                {
                    var emails = await emailResponse.Content.ReadFromJsonAsync<List<GitHubEmail>>();

                    var primary = emails.FirstOrDefault(e => e is { Primary: true, Verified: true})?.Email;

                    if(string.IsNullOrEmpty(primary))
                        return BadRequest("Failed to get email from GitHub");
                    user!.Email = primary;
                }
            }
            //step 4 - find or create user and sign in
            var existingUser = await signIn.UserManager.Users.FirstOrDefaultAsync(u => u.Email == user!.Email);

            if(existingUser == null)
            {
                existingUser = new User
                {
                    DisplayName = user.Name,
                    Email = user.Email,
                    UserName = user.Email,
                    ImageUrl = user.ImageUrl
                };
                var createResult = await signIn.UserManager.CreateAsync(existingUser);
                if (!createResult.Succeeded)
                {
                    return BadRequest("Error creating user account");
                }
            }
            await signIn.SignInAsync(existingUser, isPersistent: false);

            return Ok();
        }






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
        public async Task<ActionResult> ResendConfirmationEmail(string? email, string? userId)
        {
            if(string.IsNullOrEmpty(email) || string.IsNullOrEmpty(userId))
                return BadRequest("Email and userId are required");



            var user = await signIn.UserManager.Users
                .FirstOrDefaultAsync(u => u.Email == email || u.Id == userId);

            if (user == null || string.IsNullOrEmpty(user.Email))
                return BadRequest("Invalid email");
           
            await SendConfirmationEmailAsync(user, user.Email);
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

        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDTO passwordDTO)
        {
            var user = await signIn.UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();
            var result = await signIn.UserManager.ChangePasswordAsync(user, passwordDTO.CurrentPassword, passwordDTO.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.First().Description);
            }
            return Ok("Password changed successfully.");
        }

    }
}
