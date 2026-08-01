using ERP.Core.Entities;

namespace Opportunities.Domain.Entities
{
    public class OpportunityCommercialBreakdown : BaseEntity
    {
        public Guid OpportunityId { get; set; }
        public Guid CurrencyId { get; set; }
        public decimal FinalPayableAmount { get; set; }
        public Guid? AgreementDocumentId { get; set; }
        public DateTime? AgreementDate { get; set; }
        public DateTime? AgreementExpiryDate { get; set; }
        public Guid? PurchaseOrderDocumentId { get; set; }
        public DateTime? PurchaseOrderDate { get; set; }
        public bool LicenseApplicable { get; set; }
        public decimal? LicenseAmount { get; set; }
        public decimal? AmcAmount { get; set; }
        public DateTime? AmcStartDate { get; set; }
        public DateTime? AmcRenewalDate { get; set; }
        public DateTime? AmcExpiryDate { get; set; }
        public bool SubscriptionApplicable { get; set; }
        public decimal? SubscriptionAmount { get; set; }
        public string? SubscriptionBillingFrequency { get; set; }
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? NextSubscriptionBillingDate { get; set; }
        public bool IsFinal { get; set; }
        public string? Remarks { get; set; }

        public Opportunity? Opportunity { get; set; }
        public OpportunityCommercialDocument? AgreementDocument { get; set; }
        public OpportunityCommercialDocument? PurchaseOrderDocument { get; set; }
    }
}
