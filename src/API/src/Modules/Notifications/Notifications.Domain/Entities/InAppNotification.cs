using ERP.Core.Entities;

namespace Notifications.Domain.Entities
{
    public class InAppNotification : BaseEntity
    {
        public Guid RecipientUserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public string SourceRecordType { get; set; } = string.Empty;
        public Guid SourceRecordId { get; set; }
        public DateTime SourceDueDate { get; set; }
        public string? RelatedUrl { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadOn { get; set; }
    }
}
