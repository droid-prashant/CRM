using ERP.Core.Entities;

namespace Notifications.Domain.Entities
{
    public class NotificationConfiguration : BaseEntity
    {
        public string EventType { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public int InitialLeadTimeDays { get; set; }
        public int OverdueIntervalDays { get; set; }
        public bool InAppEnabled { get; set; } = true;
        public bool EmailEnabled { get; set; }
        public string SubjectTemplate { get; set; } = string.Empty;
        public string BodyTemplate { get; set; } = string.Empty;

        public ICollection<NotificationReminderInterval> ReminderIntervals { get; set; } = new List<NotificationReminderInterval>();
    }
}
