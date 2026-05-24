namespace Opportunities.Application.DTOs
{
    public class UpdateOpportunityRequest
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public Guid OwnerUserId { get; set; }
    }
}
