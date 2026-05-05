namespace Leads.Application.ViewModels
{
    public class OpportunityCreatedViewModel
    {
        public Guid OpportunityId { get; set; }
        public string OpportunityNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public string? OwnerUserName { get; set; }
        public string Stage { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
