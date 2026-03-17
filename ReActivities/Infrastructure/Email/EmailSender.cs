using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Resend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Email
{
    public class EmailSender(IServiceScopeFactory scopeFactory, IConfiguration config) : IEmailSender<User>
    {
        public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
        {
            var subject = "Confirm your email address";
            var body = $@"
                <p>Hi {user.DisplayName},</p>
                <p>Thank you for registering. Please click the link below to confirm your email address:</p>
                <p><a href='{confirmationLink}'>Confirm Your Email</a></p>
                <p>Thanks</p>";
            await SendMailAsync(email, subject, body);
        }

        public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
        {
            var subject = "Reset your password";
            resetCode = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(resetCode));
            var body = $@"
                <p>Hi {user.DisplayName},</p>
                <p>Please click this link to reset your password</p>
                <p><a href='{config["ClientAppUrl"]}/reset-password?email={email}&code={resetCode}'>Click to reset your password</a></p>
                <p>Thanks</p>
                <p>IF you did not request this, you can ignore this email</p>


            ";
            await SendMailAsync(email, subject, body);
        }
        

        public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
        {
            throw new NotImplementedException();
        }
        private async Task SendMailAsync(string toEmail, string subject, string htmlContent)
        {
            using var scope = scopeFactory.CreateScope();
            var resendClient = scope.ServiceProvider.GetRequiredService<ResendClient>();
            var message = new EmailMessage
            {
                To = toEmail,
                From = "whateveryouwant@resend.dev",
                Subject = subject,
                HtmlBody = htmlContent
            };
            message.To.Add(toEmail);
            Console.WriteLine(message.HtmlBody);

            await resendClient.EmailSendAsync(message);
            //await Task.CompletedTask; //for testing without sending email
        }
    }
}
    