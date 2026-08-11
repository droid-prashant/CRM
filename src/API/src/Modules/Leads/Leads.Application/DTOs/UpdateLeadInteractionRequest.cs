namespace Leads.Application.DTOs
{
    public class UpdateLeadInteractionRequest
    {
        public string InteractionType { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime? InteractionDate { get; set; }
        public DateTime? NextFollowUpDate { get; set; }
    }
}
