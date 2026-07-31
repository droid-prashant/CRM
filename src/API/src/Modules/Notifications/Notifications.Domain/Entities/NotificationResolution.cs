using ERP.Core.Entities;

namespace Notifications.Domain.Entities
{
    public class NotificationResolution : BaseEntity
    {
        public string EventType { get; set; } = string.Empty;
        public string SourceRecordType { get; set; } = string.Empty;
        public Guid SourceRecordId { get; set; }
        public DateTime SourceDueDate { get; set; }
        public bool IsResolved { get; set; }
        public DateTime? ResolvedOn { get; set; }
        public Guid? ResolvedByUserId { get; set; }
        public string? ResolutionRemarks { get; set; }
    }
}
