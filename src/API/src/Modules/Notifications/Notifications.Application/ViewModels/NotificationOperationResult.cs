namespace Notifications.Application.ViewModels
{
    public class NotificationOperationResult
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; } = string.Empty;

        public static NotificationOperationResult Success(string message) => new()
        {
            Succeeded = true,
            Message = message
        };

        public static NotificationOperationResult Failure(string message) => new()
        {
            Succeeded = false,
            Message = message
        };
    }
}
