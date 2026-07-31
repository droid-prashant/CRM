namespace Notifications.Application.ViewModels
{
    public class NotificationConfigurationViewModel
    {
        public Guid Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public int InitialLeadTimeDays { get; set; }
        public int OverdueIntervalDays { get; set; }
        public bool InAppEnabled { get; set; }
        public bool EmailEnabled { get; set; }
        public string SubjectTemplate { get; set; } = string.Empty;
        public string BodyTemplate { get; set; } = string.Empty;
        public List<int> ReminderIntervals { get; set; } = [];
    }
}
