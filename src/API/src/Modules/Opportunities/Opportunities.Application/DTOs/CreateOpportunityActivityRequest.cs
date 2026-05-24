namespace Opportunities.Application.DTOs
{
    public class CreateOpportunityActivityRequest
    {
        public string ActivityType { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime? ActivityDate { get; set; }
        public DateTime? FollowUpDate { get; set; }
    }
}
