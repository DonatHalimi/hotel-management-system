using API.Config;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using System;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
        Task SendVerificationEmailAsync(string toEmail, string firstName, string otp);
    }

    public class EmailService(EmailConfig emailConfig, ILogger<EmailService> logger) : IEmailService
    {
        private readonly EmailConfig _emailConfig = emailConfig;
        private readonly ILogger<EmailService> _logger = logger;

        public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailConfig.SenderName, _emailConfig.SenderEmail));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder();
                if (isHtml)
                {
                    bodyBuilder.HtmlBody = body;
                }
                else
                {
                    bodyBuilder.TextBody = body;
                }

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();

                await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.SmtpPort,
                    _emailConfig.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);

                await client.AuthenticateAsync(_emailConfig.Username, _emailConfig.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent successfully to {Email}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
                throw;
            }
        }

        public async Task SendVerificationEmailAsync(string toEmail, string firstName, string otp)
        {
            var subject = "Verify Email Address";
            var body = GenerateVerificationEmailBody(firstName, otp);

            await SendEmailAsync(toEmail, subject, body, true);
        }

        private string GenerateVerificationEmailBody(string firstName, string otp)
        {
            return $@"
            <html>
            <head>
                <style>
                    .container {{ max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }}
                    .content {{ padding: 30px; }}
                    .otp-code {{ 
                        background-color: #f8f9fa; 
                        border: 2px dashed #007bff; 
                        padding: 15px; 
                        text-align: center; 
                        font-size: 24px; 
                        font-weight: bold; 
                        letter-spacing: 3px;
                        margin: 20px 0;
                    }}
                    .footer {{ background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='content'>
                        <h2>Hello, {firstName}!</h2>
                        <p>Thank you for registering to HMS. To complete your registration, please use the verification code below:</p>
                        
                        <div class='otp-code'>{otp}</div>
                        
                        <p><strong>This code will expire in 10 minutes.</strong></p>
                        
                        <p>If you didn't make this request, please ignore this email.</p>
                        
                        <p>Best regards,<br>HMS</p>
                    </div>
                    <div class='footer'>
                        <p>This is an automated message, please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>";
        }
    }
}