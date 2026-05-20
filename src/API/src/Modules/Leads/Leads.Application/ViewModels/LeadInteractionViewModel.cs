namespace Leads.Application.ViewModels
{
    public class LeadInteractionViewModel
    {
        public Guid Id { get; set; }
        public Guid LeadId { get; set; }
        public string InteractionType { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime InteractionDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
        public string? CreatedByUserName { get; set; }
    }
}
