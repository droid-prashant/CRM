using ERP.Core.Entities;

namespace Opportunities.Domain.Entities
{
    public class Opportunity : BaseEntity
    {
        public string OpportunityNumber { get; set; } = string.Empty;
        public Guid? LeadId { get; set; }
        public Guid ProductId { get; set; }
        public Guid ClientId { get; set; }
        public Guid ContactId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public Guid CurrencyId { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public Guid OwnerUserId { get; set; }
        public string Stage { get; set; } = "New";
        public Guid StageId { get; set; }
        public string Status { get; set; } = "Open";
        public decimal? FinalAmount { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string? ClosingNote { get; set; }
        public string? LostReason { get; set; }

        public OpportunityStage? CurrentStage { get; set; }
        public ICollection<OpportunityStageHistory> StageHistories { get; set; } = new List<OpportunityStageHistory>();
        public ICollection<OpportunityActivity> Activities { get; set; } = new List<OpportunityActivity>();
        public ICollection<OpportunityDocument> Documents { get; set; } = new List<OpportunityDocument>();
    }
}
