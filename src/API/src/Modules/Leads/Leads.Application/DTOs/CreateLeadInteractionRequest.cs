namespace Leads.Application.DTOs
{
    public class CreateLeadInteractionRequest
    {
        public Guid LeadId { get; set; }
        public string InteractionType { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime? InteractionDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
    }
}
