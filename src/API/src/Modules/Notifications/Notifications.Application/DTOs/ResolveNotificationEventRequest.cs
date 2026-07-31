namespace Notifications.Application.DTOs
{
    public class ResolveNotificationEventRequest
    {
        public string EventType { get; set; } = string.Empty;
        public string SourceRecordType { get; set; } = string.Empty;
        public Guid SourceRecordId { get; set; }
        public DateTime SourceDueDate { get; set; }
        public string? ResolutionRemarks { get; set; }
    }
}
