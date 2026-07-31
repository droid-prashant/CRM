namespace Notifications.Application.ViewModels
{
    public class NotificationEventTypeViewModel
    {
        public string EventType { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> MergeFields { get; set; } = [];
    }
}
