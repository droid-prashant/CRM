namespace Opportunities.Application.ViewModels
{
    public class OpportunityCommercialBreakdownViewModel
    {
        public Guid Id { get; set; }
        public Guid OpportunityId { get; set; }
        public Guid CurrencyId { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public decimal FinalPayableAmount { get; set; }
        public Guid? AgreementDocumentId { get; set; }
        public string? AgreementDocumentFileName { get; set; }
        public DateTime? AgreementDate { get; set; }
        public DateTime? AgreementExpiryDate { get; set; }
        public Guid? PurchaseOrderDocumentId { get; set; }
        public string? PurchaseOrderDocumentFileName { get; set; }
        public DateTime? PurchaseOrderDate { get; set; }
        public bool AmcApplicable { get; set; }
        public decimal? AmcAmount { get; set; }
        public DateTime? AmcStartDate { get; set; }
        public DateTime? AmcRenewalDate { get; set; }
        public DateTime? AmcExpiryDate { get; set; }
        public bool SubscriptionApplicable { get; set; }
        public decimal? SubscriptionAmount { get; set; }
        public string? SubscriptionBillingFrequency { get; set; }
        public DateTime? SubscriptionStartDate { get; set; }
        public DateTime? NextSubscriptionBillingDate { get; set; }
        public string? Remarks { get; set; }
        public Guid UpdatedByUserId { get; set; }
        public string? UpdatedByUserName { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
