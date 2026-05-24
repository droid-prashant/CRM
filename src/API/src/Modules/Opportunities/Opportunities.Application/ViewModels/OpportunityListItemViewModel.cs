namespace Opportunities.Application.ViewModels
{
    public class OpportunityListItemViewModel
    {
        public Guid Id { get; set; }
        public string OpportunityNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public Guid ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public Guid ContactId { get; set; }
        public string ContactName { get; set; } = string.Empty;
        public Guid? LeadId { get; set; }
        public string? LeadNumber { get; set; }
        public Guid StageId { get; set; }
        public string StageName { get; set; } = string.Empty;
        public int StageSequence { get; set; }
        public bool IsFinalStage { get; set; }
        public decimal EstimatedValue { get; set; }
        public Guid CurrencyId { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public Guid OwnerUserId { get; set; }
        public string? OwnerUserName { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? FinalAmount { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string? ClosingNote { get; set; }
        public string? LostReason { get; set; }
    }
}
