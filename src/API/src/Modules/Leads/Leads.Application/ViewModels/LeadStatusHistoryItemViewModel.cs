namespace Leads.Application.ViewModels
{
    public class LeadStatusHistoryItemViewModel
    {
        public Guid LeadId { get; set; }
        public string PreviousStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
        public Guid ChangedByUserId { get; set; }
        public string? ChangedByUserName { get; set; }
        public string? Remarks { get; set; }
    }
}
