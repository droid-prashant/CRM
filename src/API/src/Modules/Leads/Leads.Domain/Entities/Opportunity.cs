using ERP.Core.Entities;

namespace Leads.Domain.Entities
{
    public class Opportunity : BaseEntity
    {
        public string OpportunityNumber { get; set; } = string.Empty;
        public Guid LeadId { get; set; }
        public Guid ProductId { get; set; }
        public Guid ClientId { get; set; }
        public Guid ContactId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal EstimatedValue { get; set; }
        public Guid CurrencyId { get; set; }
        public DateTime? ExpectedCloseDate { get; set; }
        public Guid OwnerUserId { get; set; }
        public string Stage { get; set; } = "New";

        public Lead? Lead { get; set; }
        public Product? Product { get; set; }
        public Client? Client { get; set; }
        public ClientContact? Contact { get; set; }
    }
}
