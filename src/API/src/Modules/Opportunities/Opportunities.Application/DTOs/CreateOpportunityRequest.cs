namespace Opportunities.Application.DTOs
{
    public class CreateOpportunityRequest
    {
        public Guid ClientId { get; set; }
        public Guid LeadId { get; set; }
        public Guid ProductId { get; set; }
        public Guid ContactId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public Guid CurrencyId { get; set; }
        public Guid OwnerUserId { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
    }
}
