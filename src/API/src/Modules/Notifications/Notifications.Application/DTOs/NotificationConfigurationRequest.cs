namespace Notifications.Application.DTOs
{
    public class NotificationConfigurationRequest
    {
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
