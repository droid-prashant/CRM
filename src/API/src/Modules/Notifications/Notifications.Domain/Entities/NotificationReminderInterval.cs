using ERP.Core.Entities;

namespace Notifications.Domain.Entities
{
    public class NotificationReminderInterval : BaseEntity
    {
        public Guid ConfigurationId { get; set; }
        public int DaysBeforeDue { get; set; }

        public NotificationConfiguration? Configuration { get; set; }
    }
}
