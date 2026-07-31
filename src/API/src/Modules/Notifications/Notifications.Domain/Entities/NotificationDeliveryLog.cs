using ERP.Core.Entities;

namespace Notifications.Domain.Entities
{
    public class NotificationDeliveryLog : BaseEntity
    {
        public string EventType { get; set; } = string.Empty;
        public string SourceRecordType { get; set; } = string.Empty;
        public Guid SourceRecordId { get; set; }
        public DateTime SourceDueDate { get; set; }
        public string ReminderKey { get; set; } = string.Empty;
        public string Channel { get; set; } = string.Empty;
        public Guid RecipientUserId { get; set; }
        public string? RecipientEmail { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ErrorMessage { get; set; }
        public DateTime? SentOn { get; set; }
        public int AttemptCount { get; set; }
    }
}
