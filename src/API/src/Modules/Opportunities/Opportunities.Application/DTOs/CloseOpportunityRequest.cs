namespace Opportunities.Application.DTOs
{
    public class CloseOpportunityRequest
    {
        public decimal? FinalAmount { get; set; }
        public string? LostReason { get; set; }
        public DateTime ClosedDate { get; set; }
        public string? Note { get; set; }
    }
}
