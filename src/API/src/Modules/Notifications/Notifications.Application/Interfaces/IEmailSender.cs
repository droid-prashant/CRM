namespace Notifications.Application.Interfaces
{
    public interface IEmailSender
    {
        Task<EmailSendResult> SendAsync(string recipientEmail, string subject, string body, CancellationToken cancellationToken);
    }

    public class EmailSendResult
    {
        public bool Succeeded { get; set; }
        public string? ErrorMessage { get; set; }

        public static EmailSendResult Success() => new() { Succeeded = true };
        public static EmailSendResult Failure(string message) => new() { Succeeded = false, ErrorMessage = message };
    }
}
