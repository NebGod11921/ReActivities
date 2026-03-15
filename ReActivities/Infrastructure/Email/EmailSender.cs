using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Resend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Email
{
    public class EmailSender(IServiceScopeFactory scopeFactory) : IEmailSender<User>
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

        public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
        {
            throw new NotImplementedException();
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
            //await Task.CompletedTask;
        }
    }
}
    